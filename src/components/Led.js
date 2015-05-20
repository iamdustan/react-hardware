import React from 'react';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';
var {PropTypes} = React;

var viewConfig = {
  uiViewClassName: 'Led',
  validAttributes: {
    pin: true,
    value: true,
    mode: true,
  },
};

class Led extends React.Component {
  render() {
    return (
      <Hardware {...this.props} />
    );
  }
}

Led.displayName = 'Led';

Led.propTypes = {
  pin: PropTypes.number.isRequired,
  mode: PropTypes.number,
  value: PropTypes.number,
};

var Hardware = createReactHardwareComponentClass(viewConfig);
Hardware.defaultProps = {mode: modes.OUTPUT};

export default Led;

