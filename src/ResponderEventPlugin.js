/** @flow */

import keyOf from 'react/lib/keyOf';

var trackedReadCount = 0;

var eventTypes = {
  /**
   * On a `touchStart`/`mouseDown`, is it desired that this element become the
   * responder?
   */
  startShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: keyOf({onStartShouldSetResponder: null}),
      captured: keyOf({onStartShouldSetResponderCapture: null})
    }
  },

  /**
   * On a `touchMove`/`mouseMove`, is it desired that this element become the
   * responder?
   */
  changeShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: keyOf({onChangeShouldSetResponder: null}),
      captured: keyOf({onChangeShouldSetResponderCapture: null})
    }
  },

  /**
   * Direct responder events dispatched directly to responder. Do not bubble.
   */
  responderStart: {registrationName: keyOf({onResponderStart: null})},
  responderChange: {registrationName: keyOf({onResponderChange: null})},
  responderEnd: {registrationName: keyOf({onResponderEnd: null})},
  responderRelease: {registrationName: keyOf({onResponderRelease: null})},
  responderTerminationRequest: {
    registrationName: keyOf({onResponderTerminationRequest: null})
  },
  responderGrant: {registrationName: keyOf({onResponderGrant: null})},
  responderReject: {registrationName: keyOf({onResponderReject: null})},
  responderTerminate: {registrationName: keyOf({onResponderTerminate: null})}
};

var ResponderEventPlugin = {

  getResponderID() {
    return responderID;
  },

  eventTypes: eventTypes,

  /**
   * We must be resilient to `topLevelTargetID` being `undefined` on
   * `touchMove`, or `touchEnd`. On certain platforms, this means that a native
   * scroll has assumed control and the original touch targets are destroyed.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    console.log('TODO: ResonderEventPlugin.extractEvents', ...arguments);
    if (isStartish(topLevelType)) {
      trackedReadCount += 1;
    } else if (isEndish(topLevelType)) {
      trackedReadCount -= 1;
      invariant(
        trackedReadCount >= 0,
        'Ended a read event which was not counted in trackedReadCount.'
      );
    }

    console.log('TODO: ResponderTouchHistoryStore.recordTouchTrack', topLevelType, nativeEvent);
    /*
    ResponderReadHistoryStore.recordTouchTrack(topLevelType, nativeEvent);

    var extracted = canTriggerTransfer(topLevelType, topLevelTargetID) ?
      setResponderAndExtractTransfer(topLevelType, topLevelTargetID, nativeEvent) :
      null;
    */
    var extracted = null;
    // Responder may or may not have transfered on a new touch start/move.
    // Regardless, whoever is the responder after any potential transfer, we
    // direct all touch start/move/ends to them in the form of
    // `onResponderMove/Start/End`. These will be called for *every* additional
    // finger that move/start/end, dispatched directly to whoever is the
    // current responder at that moment, until the responder is "released".
    //
    // These multiple individual change touch events are are always bookended
    // by `onResponderGrant`, and one of
    // (`onResponderRelease/onResponderTerminate`).
    var isResponderTouchStart = responderID && isStartish(topLevelType);
    var isResponderTouchMove = responderID && isMoveish(topLevelType);
    var isResponderTouchEnd = responderID && isEndish(topLevelType);
    var incrementalTouch =
      isResponderTouchStart ? eventTypes.responderStart :
      isResponderTouchMove ? eventTypes.responderMove :
      isResponderTouchEnd ? eventTypes.responderEnd :
      null;

    if (incrementalTouch) {
      var gesture =
        ResponderSyntheticEvent.getPooled(incrementalTouch, responderID, nativeEvent);
      gesture.touchHistory = ResponderTouchHistoryStore.touchHistory;
      EventPropagators.accumulateDirectDispatches(gesture);
      extracted = accumulate(extracted, gesture);
    }

    var isResponderTerminate =
      responderID &&
      topLevelType === EventConstants.topLevelTypes.topTouchCancel;
    var isResponderRelease =
      responderID &&
      !isResponderTerminate &&
      isEndish(topLevelType) &&
      noResponderTouches(nativeEvent);
    var finalTouch =
      isResponderTerminate ? eventTypes.responderTerminate :
      isResponderRelease ? eventTypes.responderRelease :
      null;
    if (finalTouch) {
      var finalEvent =
        ResponderSyntheticEvent.getPooled(finalTouch, responderID, nativeEvent);
      finalEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
      EventPropagators.accumulateDirectDispatches(finalEvent);
      extracted = accumulate(extracted, finalEvent);
      changeResponder(null);
    }

    var numberActiveTouches =
      ResponderTouchHistoryStore.touchHistory.numberActiveTouches;
    if (ResponderEventPlugin.GlobalInteractionHandler &&
      numberActiveTouches !== previousActiveTouches) {
      ResponderEventPlugin.GlobalInteractionHandler.onChange(
        numberActiveTouches
      );
    }
    previousActiveTouches = numberActiveTouches;

    return extracted;
  },

  GlobalResponderHandler: null,
  GlobalInteractionHandler: null,

  injection: {
    /**
     * @param {{onChange: (ReactID, ReactID) => void} GlobalResponderHandler
     * Object that handles any change in responder. Use this to inject
     * integration with an existing touch handling system etc.
     */
    injectGlobalResponderHandler: function(GlobalResponderHandler) {
      ResponderEventPlugin.GlobalResponderHandler = GlobalResponderHandler;
    },

    /**
     * @param {{onChange: (numberActiveTouches) => void} GlobalInteractionHandler
     * Object that handles any change in the number of active touches.
     */
    injectGlobalInteractionHandler: function(GlobalInteractionHandler) {
      ResponderEventPlugin.GlobalInteractionHandler = GlobalInteractionHandler;
    },
  }
};

export default ResponderEventPlugin;

