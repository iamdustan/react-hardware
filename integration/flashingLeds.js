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
    }, 2000);
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

class Application extends React.Component {
  render(): ?ReactElement {
    return (
      <Board port="/dev/tty-usbserial1">
        <FlashingLed pin={13} initialVoltage={HIGH} />
        <FlashingLed pin={14} initialVoltage={LOW} />
      </Board>
    );
  }
}

ReactHardware.render(<Application initialVoltage={255} />, '/dev/tty-usbserial1', _ => (
  console.log('ReactHardware mounted'/*, arguments*/)
));

