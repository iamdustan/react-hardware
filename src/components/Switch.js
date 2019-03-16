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
import * as React from 'react';

type Props = {
  pin: number,
  onChange: (event: HardwareEvent) => any,
};

class Switch extends React.Component<Props> {
  value = -1;

  onRead = (value: number) => {
    const {onChange} = this.props;
    if (value !== this.value) {
      this.value = value;
      onChange({value, type: 'change'});
    }
  };

  render() {
    return <pin pin={this.props.pin} onRead={this.onRead} mode={'INPUT'} />;
  }
}

export default Switch;
