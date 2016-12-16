/* @flow */

import FeatureFlags from './ReactHardwareFeatureFlags';

if (FeatureFlags.useFiber) {
  module.exports = require('./ReactHardwareFiber');
} else {
  module.exports = require('./ReactHardwareStack');
}
