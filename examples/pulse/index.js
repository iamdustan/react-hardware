/**
 * Pulsing LED example.
 * Insert an LED into Pin 9 and run this example.
 */

import {getPort} from '../port';
import ReactHardware from '../../src';
import React, {Component} from 'React';

class PulsingLed extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: 0};
  }

  componentDidMount() {
    let direction = 1;
    setInterval(() => {
      if (this.state.value >= 100) {
        direction = -1;
      } else if (this.state.value <= 0) {
        direction = 1;
      }

      this.setState({
        value: this.state.value + 5 * direction,
      });
    }, 20);
  }

  render() {
    return (
      <pin
        pin={9}
        value={this.state.value}
        mode={'PWM'}
      />
    );
  }
}

ReactHardware.render(
  <PulsingLed />,
  getPort(),
  (inst) => {
    console.log('Rendered <%s />', PulsingLed.name);
  }
);


