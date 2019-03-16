/**
 * Pulsing LED example.
 * Insert an LED into Pin 9 and run this example.
 */

import React, {Component} from 'react';
import {getPort} from '../port';
import ReactHardware from '../../src';

class FlashingLed extends Component {
  state = {
    value: 1,
  };

  update = () => {
    this.setState({
      value: this.state.value === 0 ? 1 : 0,
    });
  };

  componentDidMount() {
    setTimeout(() => {
      this.interval = setInterval(this.update, this.props.timer);
    }, this.props.delay);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timer !== this.props.timer) {
      this.updateTimer = true;
    }
  }

  componentDidUpdate() {
    if (this.updateTimer) {
      this.updateTimer = false;
      clearInterval(this.interval);
      this.interval = setInterval(this.update, this.props.timer);
    }
  }

  render() {
    return (
      <pin pin={this.props.pin} value={this.state.value} mode={'OUTPUT'} />
    );
  }
}

FlashingLed.defaultProps = {delay: 0, timer: 1000};

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
    return <pin pin={this.props.pin} value={this.state.value} mode={'PWM'} />;
  }
}

const Application = () => [
  <PulsingLed pin={9} />,
  <PulsingLed pin={10} />,
  <FlashingLed pin={11} />,
  <FlashingLed pin={12} delay={1000} />,
];

ReactHardware.render(<Application />, getPort(), inst => {
  console.log('Rendered <%s />', 'Devtools demonstration');
});
