import React from 'react';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';
import defaultPropTypes from './defaultPropTypes';
var {PropTypes} = React;

var viewConfig = {
  uiViewClassName: 'Servo',
  validAttributes: {
    pin: true,
    value: true,
    mode: true,
  },
};

class Servo extends React.Component {
  render() {
    var props = Object.assign({}, this.props);
    props.mode = modes.SERVO;

    return (
      <Hardware {...props} />
    );
  }
}

Servo.displayName = 'Servo';

Servo.propTypes = Object.assign({
  value: PropTypes.number,
}, defaultPropTypes);


var Hardware = createReactHardwareComponentClass(viewConfig);

export default Servo;

