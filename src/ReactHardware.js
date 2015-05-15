/*eslint-disable*/
import * as polys from './JSPolyfills';
/*eslint-enable*/

import ReactHardwareDefaultInjection from './ReactHardwareDefaultInjection';

ReactHardwareDefaultInjection.inject();

import ReactHardwareMount from './ReactHardwareMount';
import ReactHardwareComponents from './components';
import inputModes from './components/inputModes';

/*
var ReactChildren = require('ReactChildren');
*/
import ReactClass from 'react/lib/ReactClass';
import ReactComponent from 'react/lib/ReactComponent';
import ReactElement from 'react/lib/ReactElement';
/*
var ReactContext = require('ReactContext');
var ReactCurrentOwner = require('ReactCurrentOwner');
var ReactElementValidator = require('ReactElementValidator');
*/
import ReactPropTypes from 'react/lib/ReactPropTypes';

var {
  createElement,
  createFactory,
  cloneElement,
} = ReactElement;

var render = function(
  element: ReactElement,
  mountInto: string,
  callback?: ?(() => void)
): ?ReactComponent {
  return ReactHardwareMount.renderComponent(element, mountInto, callback);
};

import React from 'react';
var ReactHardware = Object.assign(Object.create(React), {
  hasReactHardwareInitialized: false,
  Component: ReactComponent,
  PropTypes: ReactPropTypes,
  createClass: ReactClass.createClass,
  createElement: createElement,
  createFactory: createFactory,
  cloneElement: cloneElement,
  render: render,
  mode: inputModes,
});

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
    */
    Mount: ReactHardwareMount,
    /*
    Reconciler: require('ReactReconciler'),
    TextComponent: require('ReactIOSTextComponent'),
    */
  });
}

export default ReactHardware;
