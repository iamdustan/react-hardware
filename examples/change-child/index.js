/**
 * Change a component
 *
 * Demonstrate changing the React Component communicating in a given pin
 *
 */
import React, {Component} from 'react';
import {getPort} from '../port';
import ReactHardware from '../../src';

class PulsingLed extends Component {
  constructor(props, context) {
    super(props, context);

    this.interval = null;
    this.state = {value: 0};
  }

  componentDidMount() {
    let direction = 1;
    this.interval = setInterval(() => {
      if (this.state.value >= 200) {
        direction = -1;
      } else if (this.state.value <= 0) {
        direction = 1;
      }

      this.setState({
        value: this.state.value + 5 * direction,
      });
    }, 30);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = null;
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

class FlashingLed extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: 1};
    this.interval = null;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        value: this.state.value === 0 ? 1 : 0,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = null;
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

class Application extends React.Component {
  constructor() {
    super();

    this.interval = null;
    this.state = {swapped: false};
  }

  componentDidMount() {
    this.interval = setInterval(_ => this.setState({swapped: !this.state.swapped}), 4000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = null;
  }

  render() {
    if (this.state.swapped) {
      return <PulsingLed pin={9} />;
    }

    return <FlashingLed pin={9} />;
  }
}


ReactHardware.render(
  <Application />,
  getPort(),
  inst => {
    console.log('Rendered  ChangingComponentApplication');
  }
);

