'use strict';

import keyMirror from 'react/lib/keyMirror';

// var PropagationPhases = keyMirror({bubbled: null, captured: null});

/**
 * Types of raw signals from the browser caught at the top level.
 */
// TODO: change these to custom EE event types for hardware
/*
var topLevelTypes = keyMirror({
});
*/

var PropagationPhases = {};
var topLevelTypes = {};

var EventConstants = {
  topLevelTypes,
  PropagationPhases,
};

export default EventConstants;

