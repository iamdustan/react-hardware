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

const clamp = (min, max, target) => Math.min(Math.max(target, min), max);

let crossbowInstance = null;
class Crossbow extends React.Component {
  props : P;
  static defaultProps : {} = {};
  state : S = {
    pan: defaultValue(this.props, 'pan'),
    tilt: defaultValue(this.props, 'tilt'),
    laser: 'HIGH', // the laser is always on
    actuator: ['HIGH', 'HIGH'],
  };

  componentDidMount() {
    // a hack to imperatively call methods during testing
    crossbowInstance = this;
  }

  handleJoystick = (coords : [number, number]) => {
    const [pan, tilt] = coords;
    const newPan = pan && clamp(this.props.pan.min, this.props.pan.max, pan);
    const newTilt = tilt && clamp(this.props.tilt.min, this.props.tilt.max, tilt);
    this.setState(state => ({
      pan: newPan || state.pan,
      tilt: newTilt || state.tilt,
    }));
  };

  // I wrote this really awkwaredly
  fire = () => {
    // TODO: maybe ensure servos aren't in transition when firing.
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
      speed,
    } = this.props;

    return [
      <Servo {...pan} value={this.state.pan} />,
      <Servo {...tilt} value={this.state.tilt} />,
      <Laser pin={laserPin} mode="OUTPUT" value={this.state.laser} />,
      <Joystick
        {...joystick}
        onMove={this.handleJoystick}
        onFire={this.fire}
        speed={speed}
      />,
      // the "Actuator"
      <pin mode="OUTPUT" pin={actuator.pins[0]} value={this.state.actuator[0]} />,
      <pin mode="OUTPUT" pin={actuator.pins[1]} value={this.state.actuator[1]} />,
    ];
  }
}

const Laser = props => <pin {...props} />;

// TODO: convert the Arduino `map` function to JS
const map = (val, min, max, l, r) => {
  return val;
};

class Joystick extends React.Component {
  props : {
    low: number,
    high: number,
    onMove: Function,
    onFire: () => void,
    speed: number,
  };

  reader = (data : 'FIRE' | string ) => {
    const {onFire, onMove, low, high, speed} = this.props;
    if (data === 'FIRE') {
      onFire();
      return;
    }

    const coords = data.split('|').map(Number);
    if (coords.length !== 2 || coords.some(Number.isNaN)) {
      console.warning(
        'WARNING: invalid Joystick command sent. Expected coords, received %s', data
      );
    } else {
      const [x, y] = coords;
      var newX = null;
      var newY = null;
      if (x < low || x > high) {
        newX = map(x, 0, 1023, -speed, speed);
      }
      if (y < low || x > high) {
        newY = map(x, 0, 1023, -speed, speed);
      }
      onMove([newX, newY]);
    }
  };

  render() {
    return (
      <pin
        type="SERIAL"
        onRead={this.reader}
      />
    );
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
    speed={10} // rough speed of the system. Eg how fast should the crossbow move?
  />,
  getPort(),
  (inst) => {
    console.log('Rendered a [redacted] <%s />!', 'Crossbow');
    // This can be tested by uncommenting the following line:
    // setTimeout(() => {
    //   console.log('Firing Crossbow!');
    //   crossbowInstance.fire();
    // }, 5000);
    setTimeout(() => {
      console.log('Moving Crossbow!');
      crossbowInstance.handleJoystick([500, 500]);
      setTimeout(() => {
        console.log('Moving Crossbow!');
        crossbowInstance.handleJoystick([2400, 1500]);
        setTimeout(() => {
          console.log('Moving Crossbow!');
          crossbowInstance.handleJoystick([1500, null]);
        }, 2000);
      }, 2000);
    }, 5000);
  }
);


