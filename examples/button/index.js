/**
 * An example of a generic component with a generic reader.
 *
 * While constructing a component you are free to pass a generic reader to the
 * `onRead` property. This is the raw hardware [digital|analog|i2c]Read method
 * and is as low level as you can get.
 *
 * Provided composite components like <Button /> use this to logic
 *
 * Setup your board with:
 *   Push button on pin 2
 *   LED on 11
 *   LED on 13
 */

import React, {Component} from 'react';
import {getPort} from '../port';
import ReactHardware from '../../src';

type HardwareEvent = {
  value: number,
  type: string,
};

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

const Container = props => props.children;

class App extends Component {
  constructor() {
    super();

    this.state = {on: false};
    this.toggle = (event: HardwareEvent) => {
      this.setState({on: !this.state.on});
    };
  }

  render() {
    return (
      <Container>
        <Button pin={2} onChange={this.toggle} />
        <pin pin={11} mode={'OUTPUT'} value={this.state.on ? 1 : 0} />
        <pin pin={13} mode={'OUTPUT'} value={this.state.on ? 0 : 1} />
      </Container>
    );
  }
}

ReactHardware.render(<App />, getPort(), inst => {
  console.log('Rendered <ButtonApplication />');
});
