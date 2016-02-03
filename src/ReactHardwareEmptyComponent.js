/**
 * @flow
 */
const ReactHardwareEmptyComponent = function() {
  // ReactCompositeComponent uses this:
  this._currentElement = null;

  // ReactHardwareComponent uses these
  this._rootNodeID = null;
  this._renderedChildren = null;
  this._io = null;
};

Object.assign(ReactHardwareEmptyComponent.prototype, {
  construct(element) {},

  mountComponent(
    transaction,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    // var id = nativeContainerInfo._idCounter++;
    // this._id = id;
  },

  receiveComponent() {},

  getNativeNode() {
    // TODO?
    return this;
  },

  unmountComponent() {},
});

export default ReactHardwareEmptyComponent;

