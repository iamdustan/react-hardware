/*eslint no-console:0, no-use-before-define:0*/

import ReactHardwareTagHandles from './ReactHardwareTagHandles';
import ReactReconciler from 'react/lib/ReactReconciler';
import ReactUpdateQueue from 'react/lib/ReactUpdateQueue';
import ReactUpdates from 'react/lib/ReactUpdates';
import instantiateReactComponent from 'react/lib/instantiateReactComponent';

import shouldUpdateReactComponent from 'react/lib/shouldUpdateReactComponent';
import HardwareManager from './HardwareManager';

import emptyObject from 'fbjs/lib/emptyObject';
import invariant from 'fbjs/lib/invariant';

/*
var ReactPerf = require('ReactPerf');
*/

var instanceNumberToChildRootID = function(rootNodeID, instanceNumber) {
  return `${rootNodeID}[${instanceNumber}]`;
};

/**
 * Mounts this component and inserts it into the DOM.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {number} rootID ID of the root node.
 * @param {number} container container element to mount into.
 * @param {ReactReconcileTransaction} transaction
 */
function mountComponentIntoNode(
    componentInstance: ReactComponent,
    rootID: number,
    container: number,
    transaction: any
) {
  var markup = ReactReconciler.mountComponent(
    componentInstance, rootID, transaction, emptyObject
  );
  // componentInstance._isTopLevel = true;
  ReactHardwareMount._mountImageIntoNode(markup, container);
}

/**
 * Batched mount.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {number} rootID ID of the root node.
 * @param {number} container container element to mount into.
 */
function batchedMountComponentIntoNode(
    componentInstance: ReactComponent,
    rootID: number,
    container: number
) {
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
  transaction.perform(
    mountComponentIntoNode,
    null,
    componentInstance,
    rootID,
    container,
    transaction
  );
  ReactUpdates.ReactReconcileTransaction.release(transaction);
}



/**
 * As soon as `ReactMount` is refactored to not rely on the DOM, we can share
 * code between the two. For now, we'll hard code the ID logic.
 */
var ReactHardwareMount = {
  instanceCount: 0,

  _instancesByContainerID: {},

  renderComponent(
    nextElement: ReactElement,
    containerTag: number,
    callback?: ?(() => void)
  ): ?ReactComponent {
    HardwareManager.createConnection(containerTag, () => {
      var topRootNodeID = ReactHardwareTagHandles.tagToRootNodeID[containerTag];
      if (topRootNodeID) {
        var prevComponent = ReactHardwareMount._instancesByContainerID[topRootNodeID];
        if (prevComponent) {
          var prevElement = prevComponent._currentElement;
          if (shouldUpdateReactComponent(prevElement, nextElement)) {
            ReactUpdateQueue.enqueueElementInternal(prevComponent, nextElement);
            if (callback) {
              ReactUpdateQueue.enqueueCallbackInternal(prevComponent, callback);
            }
            return prevComponent;
          } else {
            ReactHardwareMount.unmountComponentAtNode(containerTag);
          }
        }
      }

      invariant(
        ReactHardwareTagHandles.reactTagIsHardwareTopRootID(containerTag),
        'You cannot render into anything but a SerialPort connection.'
      );

      topRootNodeID = ReactHardwareTagHandles.allocateRootNodeIDForTag(containerTag);
      ReactHardwareTagHandles.associateRootNodeIDWithMountedNodeHandle(
        topRootNodeID,
        containerTag
      );

      var instance = instantiateReactComponent(nextElement);
      ReactHardwareMount._instancesByContainerID[topRootNodeID] = instance;

      HardwareManager.createConnection(containerTag);

      var childRootNodeID = instanceNumberToChildRootID(
        topRootNodeID,
        ReactHardwareMount.instanceCount++
      );

      // TODO: make the initial render asynchrounous as well
      // The initial render is synchronous but any updates that happen during
      // rendering, in componentWillMount or componentDidMount, will be batched
      // according to the current batching strategy.

      ReactUpdates.batchedUpdates(
        batchedMountComponentIntoNode,
        instance,
        childRootNodeID,
        topRootNodeID
      );
      var component = instance.getPublicInstance();
      if (callback) {
        callback.call(component);
      }
      return component;
    });
  },

  /**
   * Unmount component at container ID by iterating through each child component
   * that has been rendered and unmounting it. There should just be one child
   * component at this time.
   */
  unmountComponentAtNode(containerTag: number): boolean {
    if (!ReactHardwareTagHandles.reactTagIsHardwareTopRootID(containerTag)) {
      console.error('You cannot render into anything but a top root');
      return false;
    }

    var containerID = ReactHardwareTagHandles.tagToRootNodeID[containerTag];
    var instance = ReactHardwareMount._instancesByContainerID[containerID];
    if (!instance) {
      return false;
    }
    ReactHardwareMount.unmountComponentFromNode(instance, containerID);
    delete ReactHardwareMount._instancesByContainerID[containerID];
    return true;
  },

  getNode<T>(id: T): T {
    return id;
  },

  getID<T>(id: T): T {
    return id;
  },

  /**
   * @param {view} mountImage view tree image
   * @param {string} containerID node to insert sub-view into
   */
  _mountImageIntoNode(mountImage, containerID) {
    ReactHardwareTagHandles.associateRootNodeIDWithMountedNodeHandle(
      mountImage.rootNodeID,
      mountImage.tag
    );
    var addChildTags = [mountImage.tag];
    var addAtIndices = [0];

    // TODO: simplify this to just adding. Nothing can be removed.
    HardwareManager.manageChildren(
      ReactHardwareTagHandles.mostRecentMountedNodeHandleForRootNodeID(containerID),
      null, // moveFromIndices
      null, // moveToIndices
      addChildTags,
      addAtIndices,
      null  // removeAtIndices
    );
  },
};

export default ReactHardwareMount;

