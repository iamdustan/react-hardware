/**
 * ReactHardware <Switch /> component.
 *
 * <Switch
 *   onChange={({value}) => console.log('Switch state changed to %s', value)}
 * />
 *
 * @flow
 **/

import type {HardwareEvent} from '../types';
import React, {Component} from 'react';

type P = {
  pin: number;
  min?: number;
  max?: number;
  value: number;
}

class Servo extends Component {
  props: P;
  static defaultProps: {};

  render() {
    return (
      <pin
        pin={this.props.pin}
        min={this.props.min}
        max={this.props.max}
        value={this.props.value}
        mode={'SERVO'}
      />
    );
  }
}

export default Servo;

