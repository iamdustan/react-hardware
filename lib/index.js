import {patchReact} from './patch';
import ReactEmptyComponent from 'react/lib/ReactEmptyComponent';
import assign from 'react/lib/Object.assign';

patchReact();


/**
 * @class ReactShallowRenderer
 */
var ReactHardwareRenderer = function() {
  this._instance = null;
};

var HardwareComponent = function(element) {
  this._renderedOutput = element;
  this._currentElement = element === null || element === false ?
    ReactEmptyComponent.emptyElement :
    element;
};

HardwareComponent.prototype = {

  mountComponent() {
    console.log('HardwareComponent#mountComponent', arguments);
  },

  receiveComponent(element) {
    this._renderedOutput = element;
    this._currentElement = element === null || element === false ?
      ReactEmptyComponent.emptyElement :
      element;
  },

  unmountComponent() {
    console.log('HardwareComponent#unmountComponent', arguments);
  },

};

var HardwareComponentWrapper = function() { };
assign(
  HardwareComponentWrapper.prototype,
  ReactCompositeComponent.Mixin, {
    _instantiateReactComponent(element) {
      return new HardwareComponent(element);
    },
    _replaceNodeWithMarkupByID() {},
    _renderValidatedComponent:
      ReactCompositeComponent.Mixin.
        _renderValidatedComponentWithoutOwnerOrContext,
    /**
    * Perform an update to a mounted component. The componentWillReceiveProps and
    * shouldComponentUpdate methods are called, then (assuming the update isn't
    * skipped) the remaining update lifecycle methods are called and the DOM
    * representation is updated.
    *
    * By default, this implements React's rendering and reconciliation algorithm.
    * Sophisticated clients may wish to override this.
    *
    * @param {ReactReconcileTransaction} transaction
    * @param {ReactElement} prevParentElement
    * @param {ReactElement} nextParentElement
    * @internal
    * @overridable
    */
    updateComponent: function(
      transaction,
      prevParentElement,
      nextParentElement,
      prevUnmaskedContext,
      nextUnmaskedContext
    ) {
      var inst = this._instance;

      var nextContext = inst.context;
      var nextProps = inst.props;

      // Distinguish between a props update versus a simple state update
      if (prevParentElement !== nextParentElement) {
        nextContext = this._processContext(nextParentElement._context);
        nextProps = this._processProps(nextParentElement.props);

        if ("production" !== process.env.NODE_ENV) {
          if (nextUnmaskedContext != null) {
            this._warnIfContextsDiffer(
              nextParentElement._context,
              nextUnmaskedContext
            );
          }
        }

        // An update here will schedule an update but immediately set
        // _pendingStateQueue which will ensure that any state updates gets
        // immediately reconciled instead of waiting for the next batch.

        if (inst.componentWillReceiveProps) {
          inst.componentWillReceiveProps(nextProps, nextContext);
        }
      }

      var nextState = this._processPendingState(nextProps, nextContext);

      var shouldUpdate =
        this._pendingForceUpdate ||
        !inst.shouldComponentUpdate ||
        inst.shouldComponentUpdate(nextProps, nextState, nextContext);

      if ("production" !== process.env.NODE_ENV) {
        ("production" !== process.env.NODE_ENV ? warning(
          typeof shouldUpdate !== 'undefined',
          '%s.shouldComponentUpdate(): Returned undefined instead of a ' +
          'boolean value. Make sure to return true or false.',
          this.getName() || 'ReactCompositeComponent'
        ) : null);
      }

      if (shouldUpdate) {
        this._pendingForceUpdate = false;
        // Will set `this.props`, `this.state` and `this.context`.
        this._performComponentUpdate(
          nextParentElement,
          nextProps,
          nextState,
          nextContext,
          transaction,
          nextUnmaskedContext
        );
      } else {
        // If it's determined that a component should not update, we still want
        // to set props and state but we shortcut the rest of the update.
        this._currentElement = nextParentElement;
        this._context = nextUnmaskedContext;
        inst.props = nextProps;
        inst.state = nextState;
        inst.context = nextContext;
      }
    },

  }
);

ReactHardwareRenderer.prototype.render = function(element, context) {
  if (!context) {
    context = emptyObject;
  }
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
  this._render(element, transaction, context);
  ReactUpdates.ReactReconcileTransaction.release(transaction);
};

ReactHardwareRenderer.prototype.unmount = function() {
  if (this._instance) {
    this._instance.unmountComponent();
  }
};

ReactHardwareRenderer.prototype._render = function(element, transaction, context) {
  if (!this._instance) {
    var rootID = ReactInstanceHandles.createReactRootID();
    var instance = new HardwareComponentWrapper(element.type);
    instance.construct(element);

    instance.mountComponent(rootID, transaction, context);

    this._instance = instance;
  } else {
    this._instance.receiveComponent(element, transaction, context);
  }
};

