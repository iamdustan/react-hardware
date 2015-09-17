/** @flow */
'use strict';

import HardwareManager from './HardwareManager';
import ReactHardwareTagHandles from './ReactHardwareTagHandles';

var ReactHardwareGlobalResponderHandler = {
  onChange(from: string, to: string) {
    if (to !== null) {
      HardwareManager.setJSResponder(
        ReactHardwareTagHandles.mostRecentMountedNodeHandleForRootNodeID(to)
      );
    }
    else {
      HardwareManager.clearJSResponder();
    }
  },
};

export default ReactHardwareGlobalResponderHandler;

