/*eslint no-console:0*/
import React, {Component} from '../';

const {
  ArduinoUno,
  Button,
  Switch,
  Led,
} = React;

const HIGH = 255;
const LOW = 0;

class Application extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: LOW};
    this.toggle = this.toggle.bind(this);
    this.log = this.log.bind(this);
  }

  log(event) {
    console.log('event', event.type);
  }

  toggle(event) {
    console.log('event', event.type);
    this.setState({value: this.state.value === LOW ? HIGH : LOW});
  }

  render():ReactElement {
    return (
      <ArduinoUno>
        <Button pin={2} onChange={this.toggle} />
        <Switch
          pin={3}
          onChange={this.toggle}
          onOpen={this.log}
          onClose={this.log}
          />
        <Led pin={11} value={this.state.value} />
      </ArduinoUno>
    );
  }
}

React.render(<Application />);

