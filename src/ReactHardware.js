var __DEV__ = true;
import ReactHardwareDefaultInjection from './ReactHardwareDefaultInjection';
ReactHardwareDefaultInjection.inject();

import ReactHardwareMount from './ReactHardwareMount';
import inputModes from './components/inputModes';
import findNodeHandle from './findNodeHandle';

import ReactClass from 'react/lib/ReactClass';
import ReactComponent from 'react/lib/ReactComponent';
import ReactElement from 'react/lib/ReactElement';
import ReactCurrentOwner from 'react/lib/ReactCurrentOwner';
import ReactElementValidator from 'react/lib/ReactElementValidator';
import ReactPropTypes from 'react/lib/ReactPropTypes';
import assign from 'react/lib/Object.assign';

var {
  createElement,
  createFactory,
  cloneElement,
} = ReactElement;

if (__DEV__) {
  var {
    createElement,
    createFactory,
    cloneElement,
  } = ReactElementValidator;
}

var render = function(
  element: ReactElement,
  mountInto: string,
  callback?: ?(() => void)
): ?ReactComponent {
  return ReactHardwareMount.renderComponent(element, mountInto, callback);
};

var ReactHardware = {
  findNodeHandle: findNodeHandle,
  hasReactHardwareInitialized: false,
  Component: ReactComponent,
  PropTypes: ReactPropTypes,
  createClass: ReactClass.createClass,
  createElement: createElement,
  createFactory: createFactory,
  cloneElement: cloneElement,
  render: render,

  mode: inputModes,
};

// Inject the runtime into a devtools global hook regardless of browser.
// Allows for debugging when the hook is injected on the page.
/* globals __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
    CurrentOwner: ReactCurrentOwner,
    InstanceHandles: ReactInstanceHandles,
    Mount: ReactHardwareMount,
    Reconciler: require('ReactReconciler'),
    /*
    TextComponent: require('ReactIOSTextComponent'),
    */
  });
}

export default ReactHardware;
