/*eslint no-console:0*/
import React from '../';

const {
  ArduinoUno,
  Button,
} = React;

const HIGH = 255;
const LOW = 0;

class Application extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: LOW};
    this.toggle = this.toggle.bind(this);
    this.log = this.log.bind(this);
  }

  log(event) {
    console.log('event', event.type);
  }

  toggle(event:any) {
    console.log('event', event.type);
    this.setState({value: this.state.value === LOW ? HIGH : LOW});
  }

  render():ReactElement {
    return (
      <ArduinoUno port="/dev/tty.usbmodem1411">
        <Button
          pin={2}
          onChange={this.toggle}
          onDown={this.log}
          onUp={this.log}
          onHold={this.log}
          />
        <Led pin={13} value={this.state.value} />
      </ArduinoUno>
    );
  }
}

var PORT = '/dev/tty.usbmodem1411';
React.render(<Application value={HIGH} />, PORT);

