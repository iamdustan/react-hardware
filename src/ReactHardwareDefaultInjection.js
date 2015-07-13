/*eslint-disable*/
require('./JSPolyfills');
/*eslint-enable*/

import EventPluginHub from 'react/lib/EventPluginHub';
import EventPluginUtils from 'react/lib/EventPluginUtils';
import HardwareDefaultEventPluginOrder from './HardwareDefaultEventPluginOrder';
import HardwareBridgeEventPlugin from './HardwareBridgeEventPlugin';
import ReactClass from 'react/lib/ReactClass';
import ReactComponentEnvironment from 'react/lib/ReactComponentEnvironment';
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';
import ReactNativeComponent from 'react/lib/ReactNativeComponent';
/*
var ReactEmptyComponent = require('ReactEmptyComponent');
*/
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
/*
var ReactIOSComponentEnvironment = require('ReactIOSComponentEnvironment');
var ReactIOSComponentMixin = require('ReactIOSComponentMixin');
*/
import ReactHardwareGlobalInteractionHandler from './ReactHardwareGlobalInteractionHandler';
import ReactHardwareGlobalResponderHandler from './ReactHardwareGlobalResponderHandler';
import NodeHandle from './NodeHandle';
import ReactHardwareMount from './ReactHardwareMount';
import ReactHardwareComponentEnvironment from './ReactHardwareComponentEnvironment';
import ReactHardwareComponentMixin from './ReactHardwareComponentMixin';
import ReactUpdates from 'react/lib/ReactUpdates';
/*
var ReactIOSTextComponent = require('ReactIOSTextComponent');
*/
import UniversalWorkerNodeHandle from './UniversalWorkerNodeHandle';
import invariant from 'react/lib/invariant';

var noop = () => {};

function inject() {
  console.log('injecting');
  EventPluginHub.injection.injectEventPluginOrder(HardwareDefaultEventPluginOrder);
  EventPluginHub.injection.injectInstanceHandle(ReactInstanceHandles);

  EventPluginHub.injection.injectEventPluginsByName({
    'HardwareBridgeEventPlugin': HardwareBridgeEventPlugin,
  });

  ReactUpdates.injection.injectReconcileTransaction(
    ReactHardwareComponentEnvironment.ReactReconcileTransaction
  );

  ReactUpdates.injection.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  );

  ReactComponentEnvironment.injection.injectEnvironment(
    ReactHardwareComponentEnvironment
  );

  /*
  ReactEmptyComponent.injection.injectEmptyComponent(RCTView);
  */

  EventPluginUtils.injection.injectMount(ReactHardwareMount);

  ReactClass.injection.injectMixin(ReactHardwareComponentMixin);


  NodeHandle.injection.injectImplementation(UniversalWorkerNodeHandle);

  // TODO: maybe possibly find a better way to do this.
  // Ensure that react’s default stuff doesn’t inject into our world
  // I think that https://github.com/facebook/react/pull/3866 should
  // make this unnecessary.
  EventPluginHub.injection.injectEventPluginOrder = noop;
  EventPluginHub.injection.injectInstanceHandle = noop;
  EventPluginHub.injection.injectEventPluginsByName = noop;
  ReactUpdates.injection.injectReconcileTransaction = noop;
  ReactUpdates.injection.injectBatchingStrategy = noop;
  ReactComponentEnvironment.injection.injectEnvironment = noop;
  EventPluginUtils.injection.injectMount = noop;
  ReactClass.injection.injectMixin = noop;
  ReactNativeComponent.injection.injectAutoWrapper = noop;
  NodeHandle.injection.injectImplementation = noop;
}

module.exports = {
  inject: inject,
};

