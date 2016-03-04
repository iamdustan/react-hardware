/**
 * ReactHardware Potentiometer component for receiving feedback from a
 * potentiometer.
 *
 * The `onChange` event handler is called whenever the read value is greater
 * than the thresholdrom the previously reported value.
 *
 * <Potentiometer
 *   onChange={value => console.log('Potentiometer value: %s', value)}
 *   pin={'A1'}
 * />
 *
 * @flow
 **/

import type {HardwareEvent} from '../types';
import React, {Component} from 'react';

type P = {
  pin: number;
  onChange: (event:HardwareEvent) => any;
  threshold: number;
}

type D = {
  threshold: number;
};

class Potentiometer extends Component {
  props: P;
  static defaultProps:D = {threshold: 5};
  value: number;
  onRead: (value:number) => any;

  constructor(props:P, context:{}) {
    super(props, context);

    this.value = -1;
    this.onRead = this.onRead.bind(this);
  }

  onRead(value:number):void {
    const {onChange} = this.props;
    if (value !== this.value && Math.abs(value - this.value) > this.props.threshold) {
      this.value = value;
      onChange({value, type: 'change'});
    }
  }

  render() {
    return (
      <pin
        pin={this.props.pin}
        mode={'ANALOG'}
        onRead={this.onRead}
      />
    );
  }
}

export default Potentiometer;

