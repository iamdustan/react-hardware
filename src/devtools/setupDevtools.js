/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
import WS from 'ws';
const window = typeof window === 'undefined' ? global : window;

function setupDevtools() {
  var messageListeners = [];
  var closeListeners = [];
  var ws = new WS('ws://localhost:8097/devtools');
  // this is accessed by the eval'd backend code
  var FOR_BACKEND = { // eslint-disable-line no-unused-vars
    wall: {
      listen(fn) {
        messageListeners.push(fn);
      },
      onClose(fn) {
        closeListeners.push(fn);
      },
      send(data) {
        // console.log('sending\n%s\n', JSON.stringify(data, null, 2));
        ws.send(JSON.stringify(data));
      },
    },
  };
  ws.onclose = () => {
    setTimeout(setupDevtools, 200);
    closeListeners.forEach(fn => fn());
  };
  ws.onerror = error => {
    setTimeout(setupDevtools, 200);
    closeListeners.forEach(fn => fn());
  };
  ws.onopen = function() {
    tryToConnect();
  };

  function tryToConnect() {
    ws.send('attach:agent');
    var _interval = setInterval(() => ws.send('attach:agent'), 500);
    ws.onmessage = evt => {
      if (evt.data.indexOf('eval:') === 0) {
        clearInterval(_interval);
        initialize(evt.data.slice('eval:'.length));
      }
    };
  }

  function initialize(text) {
    try {
      // FOR_BACKEND is used by the eval'd code
      eval(text); // eslint-disable-line no-eval
    } catch (e) {
      console.error('Failed to eval: ' + e.message);
      return;
    }
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject !== 'function') {
      console.log('__REACT_DEVTOOLS_GLOBAL_HOOK__.inject is not a function!');
      console.log('This could mean you’re attempting to inject for a second time.');
    } else {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
        CurrentOwner: require('react/lib/ReactCurrentOwner'),
        InstanceHandles: require('react/lib/ReactInstanceHandles'),
        Mount: require('../ReactHardwareMount')['default'],
        Reconciler: require('react/lib/ReactReconciler'),
        // TextComponent: require('ReactNativeTextComponent'),
      });
    }

    ws.onmessage = handleMessage;
  }

  function handleMessage(evt) {
    // It's hard to handle JSON in a safe manner without inspecting it at
    // runtime, hence the any
    var data: any;
    try {
      data = JSON.parse(evt.data);
    } catch (e) {
      console.error('failed to parse json: ' + evt.data);
      return;
    }
    // the devtools closed
    if (data.$close || data.$error) {
      closeListeners.forEach(fn => fn());
      __REACT_DEVTOOLS_GLOBAL_HOOK__.emit('shutdown');
      tryToConnect();
      return;
    }
    if (data.$open) {
      return; // ignore
    }
    messageListeners.forEach(fn => {
      try {
        fn(data);
      } catch (e) {
        // jsc doesn't play so well with tracebacks that go into eval'd code,
        // so the stack trace here will stop at the `eval()` call. Getting the
        // message that caused the error is the best we can do for now.
        console.log(data);
        throw e;
      }
    });
  }
}

export default setupDevtools;
