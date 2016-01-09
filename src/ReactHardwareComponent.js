// import HardwareMethodsMixin from './HardwareMethodsMixin';
// import ReactHardwareComponentMixin from './ReactHardwareComponentMixin';
// import ReactHardwareEventEmitter from './ReactHardwareEventEmitter';
import ReactMultiChild from 'react/lib/ReactMultiChild';

import {create, diff} from './attributePayload';
import invariant from 'fbjs/lib/invariant';

import * as HardwareManager from './HardwareManager';

// TODO: typedef Transaction
type ReactReconcileTransaction = any;

type ReactHardwareComponentViewConfig = {
  validAttributes: Object;
  uiViewClassName: string;
}

const DEFAULT_VIEW_CONFIG = {
  validAttributes: {
    mode: true,
    pin: true,
    value: true,
  },
  uiViewClassName: 'GenericComponent',
};

type ViewConfig = {
  MODES: 'INPUT'|'OUTPUT'|'ANALOG'|'PWM'| 'SERVO'|'SHIFT'|'I2C'|'ONEWIRE'|'STEPPER'|'IGNORE'|'UNKNOWN';
  pin: number|string;
  value: number;
};

/**
 * @constructor ReactHardwareComponent
 * @extends ReactComponent
 * @extends ReactMultiChild
 * @param {!object} viewConfig View Configuration.
 */
const ReactHardwareComponent = function(
  viewConfig: ReactHardwareComponentViewConfig
) {
  this.viewConfig = typeof viewConfig === 'object' ? viewConfig : DEFAULT_VIEW_CONFIG;
  this._rootNodeID = null;
  this._renderedChildren = null;
  this._io = null;
};

/**
 * Mixin for containers that contain UIViews. NOTE: markup is rendered markup
 * which is a `viewID` ... see the return value for `mountComponent` !
 */
ReactHardwareComponent.Mixin = {
  getPublicInstance() {
    // TODO: This should probably use a composite wrapper
    return this;
  },

  // TODO: React 0.15 began removing construct calls and inlining directly into
  // the constructor
  construct(element) {
    this._currentElement = element;
  },

  unmountComponent() {
    // deleteAllListeners(this._rootNodeID);
    this.unmountChildren();
    this._rootNodeID = null;
  },

  /**
   * Updates the component's currently mounted representation.
   */
  receiveComponent(
    nextElement:Object,
    transaction:ReactReconcileTransaction,
    context:Object
  ) {
    const prevElement = this._currentElement;
    this._currentElement = nextElement;

    const updatePayload = Object.assign(diff(
      prevElement.props,
      nextElement.props,
      this.viewConfig.validAttributes
    ), {
      pin: nextElement.props.pin,
      mode: nextElement.props.mode,
    });

    if (process.env.NODE_ENV !== 'production') {
      invariant(
        prevElement.props.pin === nextElement.props.pin,
        'A mounted component cannot be mounted into a new Pin. The `pin` ' +
        'attribute is immutable. Check the render function of ' +
        nextElement.displayName  + '.' // TODO
      );

      if (updatePayload) {
        HardwareManager.validatePayloadForPin(this._rootID, updatePayload);
      }
    }

    if (updatePayload) {
      HardwareManager.setPayloadForPin(
        this._rootNodeID,
        updatePayload
      );
    }

    // TODO: _reconcileListenersUponUpdate(prevElement.props, nextElement.props)
    this.updateChildren(nextElement.props.children, transaction, context);
  },

  /**
   *
   */
  mountComponent(
    rootID: string, // Root ID of this subtree
    transaction: ReactReconcileTransaction, // for creating/updating
    context: Object // secret context, shhhh
  ) {
    this._rootNodeID = rootID;

    const payload = create(
      this._currentElement.props, // next props
      this.viewConfig.validAttributes
    );

    if (payload) {
      if (process.env.NODE_ENV !== 'production') {
        HardwareManager.validatePayloadForPin(rootID, payload);
      }
    }

    HardwareManager.setPayloadForPin(
      rootID,
      payload
    );

    // TODO: createView
    // HardwareManager.createView(rootID, tag, this.viewConfig.uiViewClassName, payload);

    // TODO register listeners

    // TODO: figure out what this should be for RH.
    // ReactNative initializeChildren(children, tag, transaction, context);
    //   https://github.com/facebook/react-native/blob/9f48c004ba866aa24d17242a817929462a091179/Libraries/ReactNative/ReactNativeBaseComponent.js
    //
    // ReactDOM _createInitialChildren(transaction, props, context, lazyTree);
    //   https://github.com/facebook/react/blob/master/src/renderers/dom/shared/ReactDOMComponent.js#L725
    this.initializeChildren(
      this._currentElement.props.children,
      transaction,
      context
    );

    /*
    return {
      rootNodeID: rootID,
      tag: tag,
    };
    */
  },
  initializeChildren(
    children: ReactElement,
    transaction: ReactReconcileTransaction, // for creating/updating
    context: Object // secret context, shhhh
  ) {
    const mountImages = this.mountChildren(children, transaction, context);
    console.log('initializeChildren', mountImages);
  },
};

/**
 * Order of mixins is important. ReactHardwareComponent overrides methods in
 * ReactMultiChild.
 */
Object.assign(
  ReactHardwareComponent.prototype,
  ReactMultiChild.Mixin,
  ReactHardwareComponent.Mixin
);

export default ReactHardwareComponent;

