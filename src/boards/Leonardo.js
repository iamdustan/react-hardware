/** @flow */

import React from '../ReactHardware';
import Board from '../components/Board';

// same mapping as an Uno
const pinMapping = {
  'A0': 14,
  'A1': 15,
  'A2': 16,
  'A3': 17,
  'A4': 18,
  'A5': 19,
};

var Leonardo = (props) => <Board {...props} pinMapping={pinMapping} />;
Leonardo.displayName = 'Leonardo';
export default Leonardo;

