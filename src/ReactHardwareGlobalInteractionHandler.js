/** @flow */
'use strict';

import InteractionManager from './InteractionManager';

// Interaction handle is created/cleared when responder is granted or
// released/terminated.
var interactionHandle = null;

var ReactHardwareGlobalInteractionHandler = {
  onChange(numberActiveReads: number) {
    if (numberActiveReads === 0) {
      if (interactionHandle) {
        InteractionManager.clearInteractionHandle(interactionHandle);
        interactionHandle = null;
      }
    } else if (!interactionHandle) {
      interactionHandle = InteractionManager.createInteractionHandle();
    }
  }
};

export default ReactHardwareGlobalInteractionHandler;

