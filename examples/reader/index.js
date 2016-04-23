/**
 * An example of a generic component with a generic reader.
 *
 * While constructing a component you are free to pass a generic reader to the
 * `onRead` property. This is the raw hardware [digital|analog|i2c]Read method
 * and is as low level as you can get.
 *
 * Provided composite components like <Button /> use this to logic
 */

import React, {Component} from 'react';
import {getPort} from '../port';
import ReactHardware from '../../src';

type HardwareEvent = {
  value: number;
  type: string;
};

type P = {
  pin: number;
  onChange: ?(event:HardwareEvent) => any;
  onDown: ?(event:HardwareEvent) => any;
  onUp: ?(event:HardwareEvent) => any;
}

class Button extends Component {
  props: P;
  defaultProps: {};

  constructor(props, context) {
    super(props, context);

    this.onRead = this.onRead.bind(this);
  }

  onRead(value:number) {
    if (value === 1) {
      this.props.onDown({value, type: 'down'});
    } else if (value === 0) {
      this.props.onUp({value, type: 'up'});
    }

    this.props.onChange({value, type: 'change'});
  }

  render():ReactElement {
    return (
      <pin
        pin={this.props.pin}
        onRead={this.onRead}
        mode={'INPUT'}
      />
    );
  }
}

ReactHardware.render(
  <Button />,
  getPort(),
  (inst) => {
    console.log('Rendered <%s />', Button.name);
  }
);
