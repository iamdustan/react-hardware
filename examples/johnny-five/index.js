/**
 * Pulsing LED example.
 * Insert an LED into Pin 9 and run this example.
 */

import React, {Component} from 'react';
import ReactHardware from '../../src';

import five from 'johnny-five';

class BlinkingLed extends Component {
  static defaultProps = {
    port: 13,
    period: 500,
  };

  componentDidMount() {
    this.node = new five.Led(this.props.port);
    this.node.blink(this.props.period);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.period !== nextProps.period) {
      this.node.blink(nextProps.period);
    }
  }


  render() {
    return null;
  }
}

ReactHardware.render(
  <BlinkingLed port={11} period={500} />,
  new five.Board(),
  (inst) => {
    console.log('Rendered <%s />', BlinkingLed.name);
  }
);

