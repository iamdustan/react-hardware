/*
require('InitializeJavaScriptAppEngine');
import EventPluginHub from 'react/lib/EventPluginHub';
*/
import EventPluginUtils from 'react/lib/EventPluginUtils';
/*
var IOSDefaultEventPluginOrder = require('IOSDefaultEventPluginOrder');
var IOSNativeBridgeEventPlugin = require('IOSNativeBridgeEventPlugin');
*/
import ReactClass from 'react/lib/ReactClass';
import ReactComponentEnvironment from 'react/lib/ReactComponentEnvironment';
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';
import ReactNativeComponent from 'react/lib/ReactNativeComponent';
/*
var ReactEmptyComponent = require('ReactEmptyComponent');
var ReactInstanceHandles = require('ReactInstanceHandles');
var ReactIOSComponentEnvironment = require('ReactIOSComponentEnvironment');
var ReactIOSComponentMixin = require('ReactIOSComponentMixin');
var ReactIOSGlobalInteractionHandler = require('ReactIOSGlobalInteractionHandler');
var ReactIOSGlobalResponderHandler = require('ReactIOSGlobalResponderHandler');
*/
import NodeHandle from './NodeHandle';
import ReactHardwareMount from './ReactHardwareMount';
import ReactHardwareComponentEnvironment from './ReactHardwareComponentEnvironment';
import ReactHardwareComponentMixin from './ReactHardwareComponentMixin';
import ReactUpdates from 'react/lib/ReactUpdates';
/*
var ReactIOSTextComponent = require('ReactIOSTextComponent');
var ResponderEventPlugin = require('ResponderEventPlugin');
*/
import UniversalWorkerNodeHandle from './UniversalWorkerNodeHandle';

/*
var createReactIOSNativeComponentClass = require('createReactIOSNativeComponentClass');
*/
import invariant from 'react/lib/invariant';

function inject() {
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

  ReactNativeComponent.injection.injectAutoWrapper(function(tag) {
    // Show a nicer error message for non-function tags
    var info = '';
    if (typeof tag === 'string' && /^[a-z]/.test(tag)) {
      info += ' Each component name should start with an uppercase letter.';
    }
    invariant(false, 'Expected a component class, got %s.%s', tag, info);
  });

  NodeHandle.injection.injectImplementation(UniversalWorkerNodeHandle);
}

module.exports = {
  inject: inject,
};

