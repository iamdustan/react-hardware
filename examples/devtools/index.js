/**
 * Pulsing LED example.
 * Insert an LED into Pin 9 and run this example.
 */

import {getPort} from '../port';
import ReactHardware from '../../src';
import React, {Component} from 'react';

const {Container} = ReactHardware;

class FlashingLed extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: 1};
  }

  componentDidMount() {
    setTimeout(() => {
      setInterval(() => {
        this.setState({
          value: this.state.value === 0 ? 1 : 0,
        });
      }, 1000);
    }, this.props.delay);
  }

  render() {
    return (
      <pin
        pin={this.props.pin}
        value={this.state.value}
        mode={'OUTPUT'}
      />
    );
  }
}

FlashingLed.defaultProps = {delay: 0};

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
        pin={this.props.pin}
        value={this.state.value}
        mode={'PWM'}
      />
    );
  }
}

const Application = () => (
  <Container>
    <PulsingLed pin={9} />
    <PulsingLed pin={10} />
    <FlashingLed pin={11} />
    <FlashingLed pin={12} delay={1000} />
  </Container>
);

ReactHardware.render(
  <Application />,
  getPort(),
  (inst) => {
    console.log('Rendered <%s />', 'Devtools demonstration');
  }
);



