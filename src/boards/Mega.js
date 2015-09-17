/** @flow */

import React from '../ReactHardware';
import Board from '../components/Board';

// 75
const pinMapping = {
  'A0': 54,
  'A1': 55,
  'A2': 56,
  'A3': 57,
  'A4': 58,
  'A5': 59,
  'A6': 60,
  'A7': 61,
  'A8': 62,
  'A9': 63,
};

var Mego = (props) => <Board {...props} pinMapping={pinMapping} />;
Mego.displayName = 'Mego';
export default Mego;

