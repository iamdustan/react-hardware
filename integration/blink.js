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
      value: typeof props.initialValue !== 'undefined' ? props.initialValue : HIGH,
      _interval: null,
    };
  }

  next(time) {
    var value = this.state.value === HIGH ? LOW : HIGH;
    this.setState({value});
    setTimeout(_ => {
      this.next(this.props.interval[0]);
    }, this.props.interval[1]);
  }

  componentDidMount() {
    setTimeout(_ => {
      this.next(this.props.interval[0]);

    }, this.props.delay);
  }

  componentWillUnmount() {
    clearInterval(this.state._interval);
  }

  render() {
    return (
      <Led {...this.props} value={this.state.value} />
    );
  }
}

FlashingLed.defaultProps = {
  pin: 13,
  interval: 2000,
  mode: mode.OUTPUT,
};

class Application extends React.Component {
  render():ReactElement {
    return (
      <Board>
        <FlashingLed pin={9} delay={400} interval={[200, 400]} initialValue={LOW} />
      </Board>
    );
  }
}

var PORT = '/dev/cu.usbmodem1411';
React.render(<Application />, PORT, _ => (
  console.log('ReactHardware mounted'/*, arguments*/)
));

