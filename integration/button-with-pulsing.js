/*eslint no-console:0*/
import React from '../';
import tweenState from 'react-tween-state';

const {
  Board,
  Button,
  Led,
  PropTypes,
  mode,
} = React;

const HIGH = 255;
const LOW = 0;

var PulsingLed = React.createClass({
  mixins: [tweenState.Mixin],

  propTypes: {
    easing: PropTypes.oneOf([
      'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic',
      'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart',
      'easeInOutQuart', 'easeInQuint', 'easeOutQuint', 'easeInOutQuint',
      'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInExpo', 'easeOutExpo',
      'easeInOutExpo', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
      'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack',
      'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce',
      'easeInOutBounce', PropTypes.func
    ]),
  },

  getInitialState() {
    var {initialValue = LOW} = this.props;
    return {value: initialValue};
  },

  getDefaultProps() {
    return {
      interval: 1000,
      mode: mode.PWM,
      easing: 'linear',
    };
  },

  tween() {
    var {easing} = this.props;
    console.log('tweening');

    this.tweenState('value', {
      easing: typeof easing === 'string' ? tweenState.easingTypes[easing] : easing,
      duration: this.props.duration,
      endValue: this.state.value === 0 ? HIGH : LOW,
      onEnd: () => (setTimeout(() => this.tween()), 30),
    });
  },

  componentDidMount() {
    console.log("componentDidMount");
    this.tween();
  },

  componentWillUnmount() {
    this.tweenState('value', {
      stackBehavior: tweenState.stackBehavior.DESTRUCTIVE,
      duration: 0,
      endValue: 0,
    });
  },

  render() {
    return (
      <Led {...this.props} value={this.getTweeningValue('value')} />
    );
  },
});

PulsingLed.displayName = 'FlashingLed';

class Application extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: LOW, holding: false};
    this.toggle = this.toggle.bind(this);
    this.log = this.log.bind(this);
  }

  log(event) {
    if (event.type === 'hold') {
      this.setState({holding: true});
    }
    if (event.type === 'up') {
      this.setState({holding: false});
    }
  }

  toggle(event) {
    this.setState({value: this.state.value === LOW ? HIGH : LOW});
  }

  render(): ?ReactElement {
    var pinIn13 = this.state.holding ?
      <PulsingLed pin={13} initialValue={this.state.value} /> : <Led pin={13} value={this.state.value} />;

    return (
      <Board>
        <Button
          pin={2}
          onChange={this.toggle}
          onDown={this.log}
          onUp={this.log}
          onHold={this.log}
          />
        {pinIn13}
      </Board>
    );
  }
}

var PORT = '/dev/tty.usbmodem1411';
React.render(<Application value={HIGH} />, PORT);


