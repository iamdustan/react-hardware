import ReactHardware from '../src';
import React, {Component} from 'React';

class FlashingLed extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: 255};
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        value: this.state.value === 0 ? 255 : 0,
      });
    }, 1000);
  }

  render() {
    return (
      <pin
        pin={13}
        value={this.state.value}
        mode={'OUTPUT'}
      />
    );
  }
}

ReactHardware.render(
  <FlashingLed />,
  // <pin pin={13} value={255} mode={'OUTPUT'} />,
  '/dev/tty.usbmodem1451',
  (inst) => {
    console.log('Rendered <FlashingLed />');
  }
);

