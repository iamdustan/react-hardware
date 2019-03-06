/**
 * Blinking LED.
 * This example blinks the Arduino Uno built-in LED on pin 13 every 1 second.
 */

import React, {Component} from 'react';
import {getPort} from '../port';
import ReactHardware from '../../src';

class FlashingLed extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: 1};
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        value: this.state.value === 0 ? 1 : 0,
      });
    }, 1000);
  }

  render() {
    console.log('render(%s)', this.state.value);
    return <pin pin={13} value={this.state.value} mode={'OUTPUT'} />;
  }
}

ReactHardware.render(<FlashingLed />, getPort(), inst => {
  console.log('Rendered <%s />', FlashingLed.name);
});
