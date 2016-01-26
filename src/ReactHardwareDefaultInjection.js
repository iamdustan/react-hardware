/**
 * React Hardware Default Injection
 */
import ReactInjection from 'react/lib/ReactInjection';
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';
import ReactComponentEnvironment from 'react/lib/ReactComponentEnvironment';
import ReactHardwareReconcileTransaction from './ReactHardwareReconcileTransaction';
import ReactHardwareComponent from './ReactHardwareComponent';

function inject() {
  ReactInjection.NativeComponent.injectGenericComponentClass(
    ReactHardwareComponent
  );

  ReactInjection.Updates.injectReconcileTransaction(
    ReactHardwareReconcileTransaction
  );

  ReactInjection.Updates.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  );

  ReactInjection.EmptyComponent.injectEmptyComponent('container');

  // NOTE: we're monkeypatching ReactComponentEnvironment because
  // ReactInjection.Component.injectEnvironment() currently throws,
  // as it's already injected by ReactDOM for backward compat in 0.14 betas.
  // Read more: https://github.com/Yomguithereal/react-blessed/issues/5
  ReactComponentEnvironment.processChildrenUpdates = function() {};
  ReactComponentEnvironment.replaceNodeWithMarkupByID = function() {};
}

export default {
  inject,
};

