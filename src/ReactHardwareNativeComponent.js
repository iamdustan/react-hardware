/*eslint no-console:0*/
var __DEV__ = true;
import HardwareMethodsMixin from './HardwareMethodsMixin';
import ReactHardwareComponentMixin from './ReactHardwareComponentMixin';
import ReactHardwareEventEmitter from './ReactHardwareEventEmitter';
import ReactHardwareTagHandles from './ReactHardwareTagHandles';
import ReactMultiChild from 'react/lib/ReactMultiChild';

import diffRawProperties from './diffRawProperties';
import warning from 'react/lib//warning';
import deepFreezeAndThrowOnMutationInDev from './deepFreezeAndThrowOnMutationInDev';
import HardwareManager from './HardwareManager';
import assign from 'react/lib/Object.assign';

var {
  registrationNames,
  putListener,
  deleteAllListeners,
} = ReactHardwareEventEmitter;

type ReactHardwareNativeComponentViewConfig = {
  validAttributes: Object;
  uiViewClassName: string;
}

/**
 * @constructor ReactHardwareNativeComponent
 * @extends ReactComponent
 * @extends ReactMultiChild
 * @param {!object} viewConfig View Configuration.
 */
var ReactHardwareNativeComponent = function(
  viewConfig: ReactHardwareNativeComponentViewConfig
) {
  this.viewConfig = viewConfig;
};

/**
 * Generates and caches arrays of the form:
 *
 *    [0, 1, 2, 3]
 *    [0, 1, 2, 3, 4]
 *    [0, 1]
 *
 * @param {number} size Size of array to generate.
 * @return {Array<number>} Array with values that mirror the index.
 */
var cachedIndexArray = function(size) {
  var cachedResult = cachedIndexArray._cache[size];
  if (!cachedResult) {
    var arr = [];
    for (var i = 0; i < size; i++) {
      arr[i] = i;
    }
    cachedIndexArray._cache[size] = arr;
    return cachedIndexArray._cache[size];
  } else {
    return cachedResult;
  }
};
cachedIndexArray._cache = {};

/**
 * Mixin for containers that contain UIViews. NOTE: markup is rendered markup
 * which is a `viewID` ... see the return value for `mountComponent` !
 */
ReactHardwareNativeComponent.Mixin = {
  getPublicInstance: function() {
    // TODO: This should probably use a composite wrapper
    return this;
  },

  construct: function(element) {
    this._currentElement = element;
  },

  unmountComponent: function() {
    deleteAllListeners(this._rootNodeID);
    this.unmountChildren();
    this._rootNodeID = null;
  },

  /**
   * Every native component is responsible for allocating its own `tag`, and
   * issuing the native `createView` command. But it is not responsible for
   * recording the fact that its own `rootNodeID` is associated with a
   * `nodeHandle`. Only the code that actually adds its `nodeHandle` (`tag`) as
   * a child of a container can confidently record that in
   * `ReactHardwareTagHandles`.
   */
  initializeChildren: function(children, containerTag, transaction, context) {
    var mountImages = this.mountChildren(children, transaction, context);
    // In a well balanced tree, half of the nodes are in the bottom row and have
    // no children - let's avoid calling out to the native bridge for a large
    // portion of the children.
    if (mountImages.length) {
      var indexes = cachedIndexArray(mountImages.length);
      // TODO: Pool these per platform view class. Reusing the `mountImages`
      // array would likely be a jit deopt.
      var createdTags = [];
      for (var i = 0; i < mountImages.length; i++) {
        var mountImage = mountImages[i];
        var childTag = mountImage.tag;
        var childID = mountImage.rootNodeID;
        warning(
          mountImage && mountImage.rootNodeID && mountImage.tag,
          'Mount image returned does not have required data'
        );
        ReactHardwareTagHandles.associateRootNodeIDWithMountedNodeHandle(
          childID,
          childTag
        );
        createdTags[i] = mountImage.tag;
      }
      HardwareManager
        .manageChildren(containerTag, null, null, createdTags, indexes, null);
    }
  },


  /**
   *
   * @param {!object} prevProps Previous properties
   * @param {!object} nextProps Next properties
   * @param {!object} validAttributes Set of valid attributes and how they
   *                  should be diffed
   */
  computeUpdatedProperties: function(prevProps, nextProps, validAttributes) {
    if (__DEV__) {
      for (var key in nextProps) {
        if (nextProps.hasOwnProperty(key) &&
            nextProps[key] &&
            validAttributes[key]) {
          deepFreezeAndThrowOnMutationInDev(nextProps[key]);
        }
      }
    }

    var updatePayload = diffRawProperties(
      null, // updatePayload
      prevProps,
      nextProps,
      validAttributes
    );

    return updatePayload;
  },


  /**
   * Updates the component's currently mounted representation.
   *
   * @param {object} nextElement
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   * @internal
   */
  receiveComponent: function(nextElement, transaction, context) {
    var prevElement = this._currentElement;
    this._currentElement = nextElement;

    var updatePayload = this.computeUpdatedProperties(
      prevElement.props,
      nextElement.props,
      this.viewConfig.validAttributes
    );

    if (updatePayload) {
      HardwareManager.updateView(
        ReactHardwareTagHandles.mostRecentMountedNodeHandleForRootNodeID(this._rootNodeID),
        this.viewConfig.uiViewClassName,
        updatePayload
      );
    }

    this._reconcileListenersUponUpdate(
      prevElement.props,
      nextElement.props
    );
    this.updateChildren(nextElement.props.children, transaction, context);
  },

  /**
   * @param {object} initialProps Native component props.
   */
  _registerListenersUponCreation: function(initialProps) {
    for (var key in initialProps) {
      // NOTE: The check for `!props[key]`, is only possible because this method
      // registers listeners the *first* time a component is created.
      if (registrationNames[key] && initialProps[key]) {
        var listener = initialProps[key];
        putListener(this._rootNodeID, key, listener);
      }
    }
  },

  /**
   * Reconciles event listeners, adding or removing if necessary.
   * @param {object} prevProps Native component props including events.
   * @param {object} nextProps Next native component props including events.
   */
  _reconcileListenersUponUpdate: function(prevProps, nextProps) {
    for (var key in nextProps) {
      if (registrationNames[key] && (nextProps[key] != prevProps[key])) {
        putListener(this._rootNodeID, key, nextProps[key]);
      }
    }
  },

  /**
   * @param {string} rootID Root ID of this subtree.
   * @param {Transaction} transaction For creating/updating.
   * @return {string} Unique hardware view tag.
   */
  mountComponent: function(rootID, transaction, context) {
    this._rootNodeID = rootID;

    var tag = ReactHardwareTagHandles.allocateTag();

    var updatePayload = this.computeUpdatedProperties(
      {}, // previous props
      this._currentElement.props, // next props
      this.viewConfig.validAttributes
    );
    HardwareManager.createView(tag, this.viewConfig.uiViewClassName, updatePayload);

    this._registerListenersUponCreation(this._currentElement.props);
    this.initializeChildren(
      this._currentElement.props.children,
      tag,
      transaction,
      context
    );
    return {
      rootNodeID: rootID,
      tag: tag,
    };
  },
};

/**
 * Order of mixins is important. ReactHardwareNativeComponent overrides methods in
 * ReactMultiChild.
 */
assign(
  ReactHardwareNativeComponent.prototype,
  ReactMultiChild.Mixin,
  ReactHardwareNativeComponent.Mixin,
  HardwareMethodsMixin,
  ReactHardwareComponentMixin
);

export default ReactHardwareNativeComponent;
