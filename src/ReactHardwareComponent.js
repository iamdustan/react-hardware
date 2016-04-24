/* @flow */

// import HardwareMethodsMixin from './HardwareMethodsMixin';
// import ReactHardwareComponentMixin from './ReactHardwareComponentMixin';
import ReactMultiChild from 'react/lib/ReactMultiChild';
import ReactCurrentOwner from 'react/lib/ReactCurrentOwner';

import {create, diff} from './attributePayload';
import invariant from 'fbjs/lib/invariant';
import warning from 'fbjs/lib/warning';

import * as HardwareManager from './HardwareManager';

// TODO: typedef Transaction
type ReactReconcileTransaction = any;

export type ReactHardwareComponentViewConfig = {
  validAttributes: Object;
  uiViewClassName: string;
  propTypes?: Object;
}

export const GENERIC_VIEW_CONFIG = {
  validAttributes: {
    mode: true,
    pin: true,
    value: true,
    onRead: true,
    config: true,
  },
  uiViewClassName: 'GenericComponent',
};

export const EMPTY_VIEW_CONFIG = {
  validAttributes: {},
  uiViewClassName: 'EmptyComponent',
};

function getViewConfig(type: any): ReactHardwareComponentViewConfig {
  if (type === 'pin') {
    return GENERIC_VIEW_CONFIG;
  }
  return EMPTY_VIEW_CONFIG;
}

// In some cases we might not have a owner and when
// that happens there is no need to inlcude "Check the render method of ...".
const checkRenderMethod = () => ReactCurrentOwner.owner && ReactCurrentOwner.owner.getName()
  ? ` Check the render method of "${ReactCurrentOwner.owner.getName()}".` : '';

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
 */
const ReactHardwareComponent = function(element: React$Element) {
  this._rootNodeID = null;
  this._renderedChildren = null;
  this._io = null;
  this._currentElement = element;
  this.viewConfig = getViewConfig(element.type);

  if (process.env.NODE_ENV !== 'production') {
    warning(
      element.type === 'pin' || element.type === 'container',
      'Attempted to render an unsupported generic component "%s". ' +
      'Must be "pin" or "container".%s',
      element.type,
      checkRenderMethod()
    );
  }
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

  unmountComponent() {
    // deleteAllListeners(this._rootNodeID);
    this.unmountChildren();
    this._rootNodeID = null;
  },

  /**
   * Updates the component's currently mounted representation.
   */
  receiveComponent(
    nextElement:React$Element,
    transaction:ReactReconcileTransaction,
    context:Object
  ) {
    const prevElement = this._currentElement;
    this._currentElement = nextElement;

    if (nextElement.type === 'pin') {
      const updatePayload = Object.assign(
        {},
        nextElement.props,
        diff(prevElement.props, nextElement.props, this.viewConfig.validAttributes)
      );

      if (process.env.NODE_ENV !== 'production') {
        if (prevElement.props.pin) {
          invariant(
            prevElement.props.pin === nextElement.props.pin,
            'A mounted component cannot be mounted into a new Pin. The `pin` ' +
            'attribute is immutable.%s',
            checkRenderMethod()
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

    if (this._currentElement.type === 'pin') {
      const payload = create(
        this._currentElement.props, // next props
        this.viewConfig.validAttributes
      );
      if (payload) {
        if (process.env.NODE_ENV !== 'production') {
          HardwareManager.validatePayloadForPin(rootID, payload);
        }
      }
      HardwareManager.setPayloadForPin(rootID, payload);
    }

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
