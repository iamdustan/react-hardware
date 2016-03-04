/**
 * An example of a generic component with a generic reader.
 *
 * While constructing a component you are free to pass a generic reader to the
 * `onRead` property. This is the raw hardware [digital|analog|i2c]Read method
 * and is as low level as you can get.
 *
 * Provided composite components like <Button /> use this to logic
 */

import {getPort} from '../port';
import ReactHardware from '../../src';
import React, {Component} from 'react';

const {Container} = ReactHardware;

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
    const {onDown, onUp, onChange} = this.props;
    if (value === 1 && typeof onDown === 'function') {
      onDown({value, type: 'down'});
    } else if (value === 0 && typeof onUp === 'function') {
      onUp({value, type: 'up'});
    }

    if (typeof onChange === 'function') {
      this.props.onChange({value, type: 'change'});
    }
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

class App extends React.Component {
  constructor() {
    super();

    this.state = {on: false};
    this.toggle = (event:HardwareEvent) => {
      console.log('toggle');
      this.setState({on: !this.state.on});
    };
  }

  render():ReactElement {
    return (
      <Container>
        <Button pin={2} onChange={this.toggle} />
        <led pin={11} mode={'OUTPUT'} value={this.state.on ? 1 : 0} />
        <led pin={13} mode={'OUTPUT'} value={this.state.on ? 0 : 1} />
      </Container>
    );
  }
}

ReactHardware.render(
  <App />,
  getPort(),
  (inst) => {
    console.log('Rendered <ButtonApplication />');
  }
);

