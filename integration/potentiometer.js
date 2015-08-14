/*eslint no-console:0*/
import React from '../';

const {
  Board,
  Potentiometer,
  Led,
  mode,
} = React;

const HIGH = 255;
const LOW = 0;

class Application extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: LOW};
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    var POT_LOW = 15;
    var POT_HIGH = 1000;
    var value = (event.target.value - POT_LOW) / POT_HIGH * HIGH;
    if (value < 10) value = 0;

    this.setState({value});
  }

  render(): ReactElement {
    return (
      <Board>
        <Potentiometer
          pin={'A1'}
          onChange={this.onChange}
          />
        <Led pin={11} mode={mode.PWM} value={this.state.value} />
      </Board>
    );
  }
}

var PORT = '/dev/tty.usbmodem1411';
React.render(<Application />, PORT);


