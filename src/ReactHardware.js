import ReactHardwareMount from './ReactHardwareMount';
import ReactHardwareDefaultInjection from './ReactHardwareDefaultInjection';
import Board from './components/Board';
import ReactHardwareComponents from './components';

/*
var ReactChildren = require('ReactChildren');
var ReactClass = require('ReactClass');
var ReactComponent = require('ReactComponent');
var ReactContext = require('ReactContext');
var ReactCurrentOwner = require('ReactCurrentOwner');
var ReactElement = require('ReactElement');
var ReactElementValidator = require('ReactElementValidator');
var ReactInstanceHandles = require('ReactInstanceHandles');
var ReactPropTypes = require('ReactPropTypes');

var deprecated = require('deprecated');
var invariant = require('invariant');
var onlyChild = require('onlyChild');

var {
  createElement,
  createFactory,
  cloneElement,
} = ReactElement;

*/
ReactHardwareDefaultInjection.inject();

var render = function(
  element: ReactElement,
  mountInto: string,
  callback?: ?(() => void)
): ?ReactComponent {
  return ReactHardwareMount.renderComponent(element, mountInto, callback);
};

var ReactHardware = {
  hasReactHardwareInitialized: false,
  /*
  Component: ReactComponent,
  PropTypes: ReactPropTypes,
  createClass: ReactClass.createClass,
  createElement: createElement,
  createFactory: createFactory,
  cloneElement: cloneElement,
  */
  render: render,
}

Object.assign(ReactHardware, ReactHardwareComponents);

// Inject the runtime into a devtools global hook regardless of browser.
// Allows for debugging when the hook is injected on the page.
/* globals __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
    /*
    CurrentOwner: ReactCurrentOwner,
    InstanceHandles: ReactInstanceHandles,
    Mount: ReactIOSMount,
    Reconciler: require('ReactReconciler'),
    TextComponent: require('ReactIOSTextComponent'),
    */
  });
}

export default ReactHardware;
