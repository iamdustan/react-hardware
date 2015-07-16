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

class ArduinoUno extends Board {
  render(): ReactElement {
    return (
      <Board
        {...this.props}
        pinMapping={pinMapping}
        />
    );
  }
};

ArduinoUno.defaultProps = {pinMapping};

export default ArduinoUno;

