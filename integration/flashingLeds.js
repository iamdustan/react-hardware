/*eslint react/no-multi-comp:0, no-console:0*/

import React from '../';

const {
  Board,
  Led,
  mode,
} = React;

const HIGH = 255;
const LOW = 0;

class FlashingLed extends React.Component {
  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      voltage: typeof props.initialVoltage !== 'undefined' ? props.initialVoltage : HIGH,
      _interval: null,
    };
  }

  componentDidMount() {
    this.state._interval = setInterval(_ => {
      var voltage = this.state.voltage === HIGH ? LOW : HIGH;
      this.setState({voltage});
    }, this.props.interval);
  }

  componentWillUnmount() {
    clearInterval(this.state._interval);
  }

  render() {
    return (
      <Led {...this.props} voltage={this.state.voltage} />
    );
  }
}

FlashingLed.defaultProps = {
  pin: 13,
  interval: 2000,
  mode: mode.OUTPUT,
};

class Application extends React.Component {
  render(): ?ReactElement {
    return (
      <Board>
        <FlashingLed pin={9} delay={400} interval={[200, 400]} initialVoltage={LOW} />
      </Board>
    );
  }
}

var PORT = '/dev/cu.usbmodem1411';
React.render(<Application initialVoltage={255} />, PORT, _ => (
  console.log('ReactHardware mounted'/*, arguments*/)
));

