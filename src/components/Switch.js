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
  pin: number,
  onChange: (event: HardwareEvent) => any,
};

class Switch extends Component {
  props: P;
  static defaultProps: {};
  value: number;
  onRead: (value: number) => any;

  constructor(props: P, context: {}) {
    super(props, context);

    this.value = -1;
    this.onRead = this.onRead.bind(this);
  }

  onRead(value: number) {
    const {onChange} = this.props;
    if (value !== this.value) {
      this.value = value;
      onChange({value, type: 'change'});
    }
  }

  render() {
    return <pin pin={this.props.pin} onRead={this.onRead} mode={'INPUT'} />;
  }
}

export default Switch;
