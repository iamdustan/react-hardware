/** @flow */

'use strict';

import EventPropagators from './EventPropagators';
import HardwareManager from './HardwareManager';
import SyntheticEvent from 'react/lib/SyntheticEvent';

import warning from 'fbjs/lib/warning';

var {
  customBubblingEventTypes,
  customDirectEventTypes,
} = HardwareManager;

var allTypesByEventName = {};

// TODO: likely remove all bubbling event type references.
/*
for (var bubblingTypeName in customBubblingEventTypes) {
  allTypesByEventName[bubblingTypeName] = customBubblingEventTypes[bubblingTypeName];
}
*/

for (var directTypeName in customDirectEventTypes) {
  /*
  warning(
    !customBubblingEventTypes[directTypeName],
    "Event cannot be both direct and bubbling: %s",
    directTypeName
  );
  */
  allTypesByEventName[directTypeName] = customDirectEventTypes[directTypeName];
}

var HardwareBridgeEventPlugin = {

  // eventTypes: assign({}, customBubblingEventTypes, customDirectEventTypes),
  eventTypes: {...customDirectEventTypes},

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
    topLevelType: string,
    topLevelTarget: EventTarget,
    topLevelTargetID: string,
    nativeEvent: Event
  ): ?Object {
    var bubbleDispatchConfig = null; // customBubblingEventTypes[topLevelType];
    var directDispatchConfig = customDirectEventTypes[topLevelType];
    var event = SyntheticEvent.getPooled(
      bubbleDispatchConfig || directDispatchConfig,
      topLevelTargetID,
      nativeEvent
    );
    // Warning: mutating this *may* cause issues, but it does mean that the
    // event given to a Hardware event handler *does* have a target property.
    // Research the changes made in the final 0.14 pre-releases to see if shadow
    // DOM changes had anything to do with this
    Object.assign(event, event.nativeEvent);
    if (bubbleDispatchConfig) {
      EventPropagators.accumulateTwoPhaseDispatches(event);
    } else if (directDispatchConfig) {
      EventPropagators.accumulateDirectDispatches(event);
    } else {
      return null;
    }
    return event;
  }
};

export default HardwareBridgeEventPlugin;

