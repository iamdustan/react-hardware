/** @flow */

import React from '../ReactHardware';
import Board from '../components/Board';

const pinMapping = {
  'A0': 14,
  'A1': 15,
  'A2': 16,
  'A3': 17,
  'A4': 18,
  'A5': 19,
};

var ArduinoUno = (props) => <Board {...props} pinMapping={pinMapping} />;
ArduinoUno.displayName = 'ArduinoUno';
export default ArduinoUno;

