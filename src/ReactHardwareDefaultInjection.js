/**
 * React Hardware Default Injection
 *
 * @flow
 */
import './devtools/InitializeJavaScriptAppEngine';
import ReactInjection from 'react/lib/ReactInjection';
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';
import ReactComponentEnvironment from 'react/lib/ReactComponentEnvironment';
import ReactHardwareReconcileTransaction from './ReactHardwareReconcileTransaction';
import ReactHardwareComponent from './ReactHardwareComponent';
import ReactHardwareEmptyComponent from './ReactHardwareEmptyComponent';

function inject() {
  ReactInjection.NativeComponent.injectGenericComponentClass(
    ReactHardwareComponent
  );

  // Maybe?
  ReactInjection.NativeComponent.injectTextComponentClass(
    (instantiate) => new ReactHardwareEmptyComponent(instantiate)
  );

  ReactInjection.Updates.injectReconcileTransaction(
    ReactHardwareReconcileTransaction
  );

  ReactInjection.Updates.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  );

  ReactInjection.EmptyComponent.injectEmptyComponentFactory(
    (instantiate) => new ReactHardwareEmptyComponent(instantiate)
  );

  ReactComponentEnvironment.processChildrenUpdates = function() {};
  ReactComponentEnvironment.replaceNodeWithMarkup = function() {};
  ReactComponentEnvironment.unmountIDFromEnvironment = function() {};
}

export default {
  inject,
};

