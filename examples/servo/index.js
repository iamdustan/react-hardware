/**
 * servo.
 * This is a simple example of a servo animating open and closed.
 */

import React from 'react';
import {getPort} from '../port';
import ReactHardware, {Servo} from '../../src';

class Application extends React.Component {
  render() {
    return (
      <Servo
        min={0}
        max={180}
        value={90}
      />
    );
  }
}

ReactHardware.render(
  <Application />,
  getPort(),
  (inst) => {
    console.log('Rendered <%s />', 'Servo');
  }
);

