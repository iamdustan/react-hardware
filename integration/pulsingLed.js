/*eslint react/no-multi-comp:0, no-console:0*/
import React from '../';
import tweenState from 'react-tween-state';

const {
  Board,
  Led,
  mode,
  PropTypes,
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
    var {initialVoltage = LOW} = this.props;
    return {voltage: initialVoltage};
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

    this.tweenState('voltage', {
      easing: typeof easing === 'string' ? tweenState.easingTypes[easing] : easing,
      duration: this.props.duration,
      endValue: this.state.voltage === 0 ? HIGH : LOW,
      onEnd: () => (setTimeout(() => this.tween()), 30),
    });
  },

  componentDidMount() {
    this.tween();
  },

  componentWillUnmount() {
    clearInterval(this.state._interval);
  },

  render() {
    return (
      <Led {...this.props} voltage={this.getTweeningValue('voltage')} />
    );
  },
});

class Application extends React.Component {
  render(): ?ReactElement {
    return (
      <Board port="/dev/cu.usbmodem1411">
        <PulsingLed pin={9} duration={1000} easing='linear' />
      </Board>
    );
  }
}

var PORT = '/dev/cu.usbmodem1411';
React.render(<Application initialVoltage={255} />, PORT, _ => (
  console.log('React mounted'/*, arguments*/)
));


