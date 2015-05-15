/*eslint react/no-multi-comp:0, no-console:0*/
import React from '../';
import tweenState from 'react-tween-state';

const {
  Board,
  Servo,
  mode,
  PropTypes,
} = React;

// angle
const HIGH = 90;
const LOW = 0;

var SweepingServo = React.createClass({
  mixins: [tweenState.Mixin],

  getInitialState() {
    return {value: this.props.duration[0]};
  },

  getDefaultProps() {
    return {
      range: [0, 180],
      duration: 66.6666 * 20,
    };
  },

  tween() {
    this.tweenState('value', {
      easing: tweenState.easingTypes.linear,
      duration: this.props.duration,
      endValue: this.state.value === this.props.range[0] ?
        this.props.range[1] :
        this.props.range[0],
      onEnd: this.tween,
    });
  },

  componentDidMount() {
    this.tween();
  },

  render() {
    return (
      <Servo {...this.props} value={this.getTweeningValue('value')} />
    );
  },

});

class Application extends React.Component {
  render(): ?ReactElement {
    return (
      <Board>
        <SweepingServo
          pin={9}
          range={[45, 135]}
          duration={1000}
        />
      </Board>
    );
  }
}

var PORT = '/dev/cu.usbmodem1411';
React.render(<Application />, PORT);

