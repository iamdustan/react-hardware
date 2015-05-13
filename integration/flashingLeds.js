import React from 'react';
import ReactHardware from '../';

const {
  Board,
  Led,
} = ReactHardware;

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
};

class Application extends React.Component {
  render(): ?ReactElement {
    return (
      <Board port="/dev/cu.usbmodem1411">
        <FlashingLed pin={2} interval={500} initialVoltage={HIGH} />
        <FlashingLed pin={3} interval={500} initialVoltage={LOW} />
      </Board>
    );
  }
}

ReactHardware.render(<Application initialVoltage={255} />, '/dev/cu.usbmodem1411', _ => (
  console.log('ReactHardware mounted'/*, arguments*/)
));

