import ReactHardwareTagHandles from './ReactHardwareTagHandles';

import invariant from 'react/lib/invariant';

var UniversalWorkerNodeHandle = {
  getRootNodeID(nodeHandle) {
    invariant(
      nodeHandle !== undefined && nodeHandle !== null && nodeHandle !== 0,
      'No node handle defined'
    );
    return ReactHardwareTagHandles.tagToRootNodeID[nodeHandle];
  },
};

export default UniversalWorkerNodeHandle;

