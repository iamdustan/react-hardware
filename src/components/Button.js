/**
 * ReactHardware <Button /> component.
 *
 * <Button
 *   onDown={() => console.log('Button pressed')}
 *   onUp={() => console.log('Button depressed')}
 *   onChange={({value}) => console.log('Button changes to %s', value)}
 * />
 *
 * @flow
 **/
import type {HardwareEvent} from '../types';
import React, {Component} from 'react';

type P = {
  pin: number,
  onChange: ?(event: HardwareEvent) => any,
  onDown: ?(event: HardwareEvent) => any,
  onUp: ?(event: HardwareEvent) => any,
};

class Button extends Component {
  props: P;
  defaultProps: {};
  onRead: (value: number) => any;

  constructor(props: P, context: {}) {
    super(props, context);

    this.onRead = this.onRead.bind(this);
  }

  onRead(value: number) {
    const {onDown, onUp, onChange} = this.props;
    if (value === 1 && typeof onDown === 'function') {
      onDown({value, type: 'down'});
    } else if (value === 0 && typeof onUp === 'function') {
      onUp({value, type: 'up'});
    }

    if (typeof onChange === 'function') {
      onChange({value, type: 'change'});
    }
  }

  render() {
    return <pin pin={this.props.pin} onRead={this.onRead} mode={'INPUT'} />;
  }
}

export default Button;
