/* @flow */

"use strict";

import EventPluginHub from 'react/lib/EventPluginHub';
import ReactEventEmitterMixin from 'react/lib/ReactEventEmitterMixin';
import ReactHardwareTagHandles from './ReactHardwareTagHandles';
import NodeHandle from './NodeHandle';

import assign from 'react/lib/Object.assign';
import warning from 'react/lib/warning';


/**
 * Version of `ReactBrowserEventEmitter` that works on the receiving side of a
 * serialized worker boundary. Lulz there is no worker boundary.
 */

// Shared default empty native event - conserve memory.
var EMPTY_NATIVE_EVENT = {};

/**
 * `ReactHardwareEventEmitter` is used to attach top-level event listeners. For
 * example:
 *
 *   ReactHardwareEventEmitter.putListener('myID', 'onDown', myFunction);
 *
 * This would allocate a "registration" of `('onDown', myFunction)` on 'myID'.
 *
 * @internal
 */
var ReactHardwareEventEmitter = assign({}, ReactEventEmitterMixin, {

  registrationNames: EventPluginHub.registrationNameModules,

  putListener: EventPluginHub.putListener,

  getListener: EventPluginHub.getListener,

  deleteListener: EventPluginHub.deleteListener,

  deleteAllListeners: EventPluginHub.deleteAllListeners,

  /**
   * Internal version of `receiveEvent` in terms of normalized (non-tag)
   * `rootNodeID`.
   *
   * @see receiveEvent.
   *
   * @param {rootNodeID} rootNodeID React root node ID that event occured on.
   * @param {TopLevelType} topLevelType Top level type of event.
   * @param {object} nativeEventParam Object passed from native.
   */
  _receiveRootNodeIDEvent: function(
    rootNodeID: ?string,
    topLevelType: string,
    nativeEventParam: Object
  ) {
    var nativeEvent = nativeEventParam || EMPTY_NATIVE_EVENT;
    ReactHardwareEventEmitter.handleTopLevel(
      topLevelType,
      rootNodeID,
      rootNodeID,
      nativeEvent
    );
  },

  /**
   * Publically exposed method on module for native objc to invoke when a top
   * level event is extracted.
   * @param {rootNodeID} rootNodeID React root node ID that event occured on.
   * @param {TopLevelType} topLevelType Top level type of event.
   * @param {object} nativeEventParam Object passed from native.
   */
  receiveEvent: function(
    tag: number,
    topLevelType: string,
    nativeEventParam: Object
  ) {
    var rootNodeID = ReactHardwareTagHandles.tagToRootNodeID[tag];
    ReactHardwareEventEmitter._receiveRootNodeIDEvent(
      rootNodeID,
      topLevelType,
      nativeEventParam
    );
  },

  /**
   */
  receiveReads: function(
    eventTopLevelType: string,
    reads: Array<Object>,
    changedIndices: Array<number>
  ) {
    console.log('TODO: receiveReads: %s', eventTopLevelType, reads);
    /*
    var changedReads =
      eventTopLevelType === topLevelTypes.topTouchEnd ||
      eventTopLevelType === topLevelTypes.topTouchCancel ?
      removeTouchesAtIndices(touches, changedIndices) :
      touchSubsequence(touches, changedIndices);

    for (var jj = 0; jj < changedTouches.length; jj++) {
      var touch = changedTouches[jj];
      // Touch objects can fullfill the role of `DOM` `Event` objects if we set
      // the `changedTouches`/`touches`. This saves allocations.
      touch.changedTouches = changedTouches;
      touch.touches = touches;
      var nativeEvent = touch;
      var rootNodeID = null;
      var target = nativeEvent.target;
      if (target !== null && target !== undefined) {
        if (target < ReactHardwareTagHandles.tagsStartAt) {
          if (__DEV__) {
            warning(
              false,
              'A view is reporting that a touch occured on tag zero.'
            );
          }
        } else {
          rootNodeID = NodeHandle.getRootNodeID(target);
        }
      }
      ReactHardwareEventEmitter._receiveRootNodeIDEvent(
        rootNodeID,
        eventTopLevelType,
        nativeEvent
      );
    }
    */
  }
});

export default ReactHardwareEventEmitter;

