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
import * as React from 'react';

type Props = {
  pin: number,
  onChange: (event: HardwareEvent) => any,
  threshold: number,
};

class Potentiometer extends React.Component<Props> {
  value = -1;

  onRead = (value: number) => {
    const {onChange} = this.props;
    if (
      value !== this.value &&
      Math.abs(value - this.value) > this.props.threshold
    ) {
      this.value = value;
      onChange({value, type: 'change'});
    }
  };

  render() {
    return <pin pin={this.props.pin} mode={'ANALOG'} onRead={this.onRead} />;
  }
}

export default Potentiometer;
