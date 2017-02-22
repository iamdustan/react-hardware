/**
 * crossbow.
 * Ken Wheeler and Dustan Kasten made a digital baby.
 */

import React from 'react';
import {getPort} from '../port';

import ReactHardware, {
  Servo
} from '../../src';

type Pin = number;
type ServoOpts = {|
  pin: Pin,
  min: number,
  max: number,
  initialValue?: number,
|};

type P = {|
  pan: ServoOpts,
  tilt: ServoOpts,
  joystick: {|
    low: number,
    high: number,
  |},
  laserPin: Pin,
  actuator: {|
    pins: [Pin, Pin],
    delay: number,
  |}
|};

type S = {|
  pan: number,
  tilt: number,
  laser: number,
|};

// default value for a servo is either a provided initial value
// or the half-way mark between min-and-max
const defaultValue = (props : P, key : 'pan' | 'tilt') =>
  typeof props[key].initialValue === 'number' ?
    props[key].initialValue :
    Math.floor((props[key].min + props[key].max) / 2);

let crossbowInstance = null;
class Crossbow extends React.Component {
  props : P;
  static defaultProps : {} = {};
  state : S = {
    pan: defaultValue(this.props, 'pan'),
    tilt: defaultValue(this.props, 'tilt'),
    laser: 'HIGH',
    actuator: ['HIGH', 'HIGH'],
  };

  componentDidMount() {
    // a hack to imperatively call methods during testing
    crossbowInstance = this;
  }

  handleJoystick = (event) => {
    console.log('TODO: handleJoystick', event);
  };

  // I wrote this really awkwaredly
  fire = () => {
    const extend = ['HIGH', 'LOW'];
    const retract = ['LOW', 'HIGH'];
    const stop = ['HIGH', 'HIGH'];
    const {delay} = this.props.actuator;
    const step = (updater, callback) => (delay) => () => {
      this.setState(updater, callback && (() => setTimeout(callback, delay)));
    };

    const c = step((state) => ({actuator: stop}));
    const b = step((state) => ({actuator: retract}), c(delay));
    const a = step((state) => ({actuator: extend}), b(delay));
    a(delay)();
  };

  render() {
    const {
      pan,
      tilt,
      joystick,
      laserPin,
      actuator,
    } = this.props;
    return [
      <Servo {...pan} />,
      <Servo {...tilt} />,
      <Laser pin={laserPin} value={this.state.laser} />,
      <Joystick
        {...joystick}
        onMove={this.handleJoystick}
        onFire={this.fire} />,
      // the "Actuator"
      <pin mode="OUTPUT" pin={actuator.pins[0]} value={this.state.actuator[0]} />,
      <pin mode="OUTPUT" pin={actuator.pins[1]} value={this.state.actuator[1]} />,
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
    actuator={{
      pins: [7, 8],
      delay: 1500,
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
    // This can be tested by uncommenting the following line:
    // setTimeout(() => {
    //   console.log('Firing Crossbow!');
    //   crossbowInstance.fire();
    // }, 5000);
  }
);


