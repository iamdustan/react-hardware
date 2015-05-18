/** @flow */
'use strict';

import HardwareManager from './HardwareManager';
import findNodeHandle from './findNodeHandle';

import invariant from 'react/lib/invariant';

var HardwareMethodsMixin = {
  measure(callback: MeasureOnSuccessCallback) {
    console.log('HardwareMethodsMixin#measure', this);
    HardwareManager.measure(
      findNodeHandle(this),
      mountSafeCallback(this, callback)
    );
  },
};

/**
 * In the future, we should cleanup callbacks by cancelling them instead of
 * using this.
 */
var mountSafeCallback = function(context: ReactComponent, callback: ?Function): any {
  return function() {
    if (!callback || (context.isMounted && !context.isMounted())) {
      return;
    }
    return callback.apply(context, arguments);
  };
};

export default HardwareMethodsMixin;

