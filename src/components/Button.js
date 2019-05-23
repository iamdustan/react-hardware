/**
 * ReactHardware <Button /> component.
 *
 * <Button
 *   internalPullup
 *   onDown={() => console.log('Button pressed')}
 *   onUp={() => console.log('Button depressed')}
 *   onChange={({value}) => console.log('Button changes to %s', value)}
 * />
 *
 * @flow
 **/
import type {HardwareEvent} from '../types';
import * as React from 'react';

type Props = {
  pin: number,
  onChange: ?(event: HardwareEvent) => any,
  onDown: ?(event: HardwareEvent) => any,
  onUp: ?(event: HardwareEvent) => any,
  internalPullup: ?boolean,
};

class Button extends React.Component<Props> {
  onRead = (observedValue: number) => {
    const {onDown, onUp, onChange, internalPullup} = this.props;

    const value = internalPullup ? +!observedValue : observedValue;

    if (value === 1 && typeof onDown === 'function') {
      onDown({value, type: 'down'});
    } else if (value === 0 && typeof onUp === 'function') {
      onUp({value, type: 'up'});
    }

    if (typeof onChange === 'function') {
      onChange({value, type: 'change'});
    }
  };

  render() {
    return (
      <pin
        pin={this.props.pin}
        onRead={this.onRead}
        mode={this.props.internalPullup ? 'PULLUP' : 'INPUT'}
      />
    );
  }
}

export default Button;
