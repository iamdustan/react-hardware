import React from 'react';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';

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

var Hardware = createReactHardwareComponentClass(viewConfig);

export default Servo;

