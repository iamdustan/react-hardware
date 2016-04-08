/* @flow */

// import HardwareMethodsMixin from './HardwareMethodsMixin';
// import ReactHardwareComponentMixin from './ReactHardwareComponentMixin';
import {CONTAINER_KEY, CONTAINER_VALUE} from './components/Container';
import ReactMultiChild from 'react/lib/ReactMultiChild';

import {create, diff} from './attributePayload';
import invariant from 'fbjs/lib/invariant';

import * as HardwareManager from './HardwareManager';

// TODO: typedef Transaction
type ReactReconcileTransaction = any;

export type ReactHardwareComponentViewConfig = {
  validAttributes: Object;
  uiViewClassName: string;
  propTypes?: Object;
}

export const DEFAULT_VIEW_CONFIG = {
  validAttributes: {
    mode: true,
    pin: true,
    value: true,
    onRead: true,
  },
  uiViewClassName: 'GenericComponent',
};

/*
type ViewConfigPropTypes = {
  mode: 'INPUT'|'OUTPUT'|'ANALOG'|'PWM'| 'SERVO'|'SHIFT'|'I2C'|'ONEWIRE'|'STEPPER'|'IGNORE'|'UNKNOWN';
  pin?: number|string;
  pins?: Array<number>;
  value: number;
};
*/

/**
 * @constructor ReactHardwareComponent
 * @extends ReactComponent
 * @extends ReactMultiChild
 * @param {!object} viewConfig View Configuration.
 */
const ReactHardwareComponent = function(
  element: React$Element
) {
  this.viewConfig = DEFAULT_VIEW_CONFIG;
  this._rootNodeID = null;
  this._renderedChildren = null;
  this._io = null;
  this.construct(element);
};

/**
 * Mixin for hardware components.
 */
ReactHardwareComponent.Mixin = {
  // this is called when changing a component in the middle of a tree
  // currently a noop since _nativeNode is not defined.
  getNativeNode() {
    return this._nativeNode;
  },

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

    if (this._currentElement.props[CONTAINER_KEY] === CONTAINER_VALUE) {
      this.updateChildren(nextElement.props.children, transaction, context);
      return;
    }

    const updatePayload = Object.assign(
      {},
      nextElement.props,
      diff(
        prevElement.props,
        nextElement.props,
        this.viewConfig.validAttributes
      )
    );

    if (process.env.NODE_ENV !== 'production') {
      if (prevElement.props.pin) {
        invariant(
          prevElement.props.pin === nextElement.props.pin,
          'A mounted component cannot be mounted into a new Pin. The `pin` ' +
          'attribute is immutable. Check the render function of ' +
          nextElement.displayName  + '.' // TODO
        );
      } else if (prevElement.props.pins) {
        console.log('TODO: multiple pins');
      }

      if (updatePayload) {
        HardwareManager.validatePayloadForPin(this._rootNodeID, updatePayload);
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
    transaction: ReactReconcileTransaction, // for creating/updating
    rootID: string, // Root ID of this subtree
    nativeContainerInfo, // nativeContainerInfo
    context: Object // secret context, shhhh
  ) {
    rootID = typeof rootID === 'object' ? rootID._rootNodeID : rootID;

    this._rootNodeID = rootID;
    if (this._currentElement.props[CONTAINER_KEY] === CONTAINER_VALUE) {
      this.initializeChildren(
        this._currentElement.props.children,
        transaction,
        context
      );

      return rootID;
    }

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

    return rootID;
  },

  initializeChildren(
    children: React$Element,
    transaction: ReactReconcileTransaction, // for creating/updating
    context: Object // secret context, shhhh
  ) {
    this.mountChildren(children, transaction, context);
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

