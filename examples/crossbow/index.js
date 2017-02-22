/**
 * crossbow.
 * Ken Wheeler and Dustan Kasten made a digital baby.
 */

import React from 'react';
import {getPort} from '../port';

import ReactHardware, {
  Servo
} from '../../src';

type ServoOpts = {|
  pin: number,
  min: number,
  max: number,
|};

type P = {
  pan: ServoOpts,
  tilt: ServoOpts,
  joystick: {|
    low: number,
    high: number,
  |},
  laserPin: number,
};

type S = void;

class Crossbow extends React.Component {
  props : P;
  static defaultProps : {} = {};
  state : S;

  render() {
    const {
      pan,
      tilt,
      joystick,
      laserPin,
    } = this.props;

    return [
      <Servo {...pan} />,
      <Servo {...tilt} />,
      <Laser pin={laserPin} value={this.state.laser} />,
      <Joystick {...joystick} />,
    ];
  }
}

// TODO
class Laser extends React.Component {
  render() {
    return null;
  }
}

// TODO
class Joystick extends React.Component {
  render() {
    return null;
  }
}

ReactHardware.render(
  <Crossbow
    pan={{
      pin: 10,
      min: 600, // full counterclockwise for RobotGeek 180 degree servo
      max: 2400, // full clockwise for RobotGeek 180 degree servo
    }}
    tilt={{
      pin: 11,
      min: 1350, // full counterclockwise for RobotGeek 180 degree servo
      max: 1800, // full clockwise for RobotGeek 180 degree servo
    }}

    joystick={{
      // deadband values for the joysticks - values between DEADBANDLOW and DEADBANDHIGH will be ignored
      low: 480, // lower deadband value for the joysticks
      high: 540, // upper deadband value for the joysticks
    }}
    laserPin={2}
  />,
  getPort(),
  (inst) => {
    console.log('Rendered a [redacted] <%s />!', 'Crossbow');
  }
);


