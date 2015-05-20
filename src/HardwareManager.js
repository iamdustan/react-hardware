/*eslint no-console:0*/
import {Board} from 'firmata';
// import ReactHardwareTagHandles from './ReactHardwareTagHandles';
import warning from 'react/lib/warning';
import invariant from 'react/lib/invariant';
var capitalize = w => `${w[0].toUpperCase()}${w.slice(1)}`;

var WRITE_TYPE = {
  [0x00]: 'digital', // input
  [0x01]: 'digital', //output
  [0x02]: 'analog', // analog
  [0x03]: 'analog', // pwm
  [0x04]: 'servo',  // servo
};

var Registry = {
  children: [],
};

var noop = () => {};
var HardwareManager = {
  createConnection(containerTag, callback = noop) {
    var onConnect = (err) => {
      if (err) {
        throw err;
      }
      console.log('Connected to %s', containerTag);
      Registry[containerTag].isConnected = true;
      Registry[containerTag].onReadyQueue.forEach(fn => fn());
      callback();
    };

    if (Registry[containerTag]) {
      if (Registry[containerTag].isConnected) {
        callback();
      }
    }
    else {
      Registry[containerTag] = {
        board: new Board(containerTag, onConnect),
        isReady: false,
        onReadyQueue: [],
        children: [],
      };

      Registry.board = Registry[containerTag].board;
    }

    return Registry[containerTag];
  },

  manageChildren(
    componentTag,
    // TODO (remove): most of these are unnecessary in the hardware environment
    moveFromIndices,
    moveToIndices,
    addChildTags,
    addAtIndices,
    removeAtIndices
  ) {
    console.log('TODO: HardwareManager#manageChildren');
  },

  createView(
    tag: number,
    name: string,
    payload: Object
  ) {
    if (!payload || typeof payload.pin === 'undefined') {
      warning(
        name === 'Board',
        'A component `%s` must have a pin to render.', name
      );
      return;
    }

    Registry.children[tag] = {
      name: name,
      props: payload,
    };

    // TODO: support more payload modes?
    Registry.board.pinMode(payload.pin, payload.mode);

    // console.log(`${WRITE_TYPE[payload.mode]}Write`, payload.pin, payload.value);
    Registry.board[`${WRITE_TYPE[payload.mode]}Write`](payload.pin, payload.value);
    console.log('create', payload);
  },

  updateView(
    tag: number,
    _name: string,
    payload: Object
  ) {

    var {
      name,
      props,
    } = Registry.children[tag];

    invariant(
      name === _name,
      'It appears like you’re trying to update a view in pin %s to a new ' +
      'component type.',
      tag, name, _name
    );

    // TODO: Make this much less ugly
    if (typeof payload.mode !== 'undefined') {
      Registry.board.pinMode(props.pin, payload.mode);
      props.mode = payload.mode;
    }


    if (typeof payload.value !== 'undefined') {
      // console.log(`${WRITE_TYPE[props.mode]}Write`, props.pin, payload.value);
      Registry.board[`${WRITE_TYPE[props.mode]}Write`](props.pin, payload.value);
    }

    Object.assign(props, payload);
  },

  read(tag: number, callback: Function) {
    var {props} = Registry.children[tag];
    Registry.children[tag].readListener = callback;

    Registry.board[`${WRITE_TYPE[props.mode]}Read`](props.pin, callback);
  },

  destroyRead(tag: number) {
    var {
      props,
      readListener,
    } = Registry.children[tag];

    Registry.board[`report${capitalize(WRITE_TYPE[props.mode])}Pin`](props.pin, 0);
    Registry.board.removeListener(`digital-read-${props.pin}`, readListener);
  },

  measure(tag: number, callback: Function) {
    var {
      props,
      reader,
    } = Registry.children[tag];
    console.log('TODO: HardwareManager.measure');
  },

  setJSResponder(tag: number) {
    console.log('TODO: HardwareManager#setJSResponder to %s', tag);
  },

  clearJSResponder() {
    console.log('TODO: HardwareManager#clearJSResponder');
  },

  customDirectEventTypes: {
    topChange: {registrationName: 'onChange'},
    topDown: {registrationName: 'onDown'},
    topUp: {registrationName: 'onUp'},
    topHold: {registrationName: 'onHold'},
  },
};

export default HardwareManager;

