import React from 'react';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';

var viewConfig = {
  uiViewClassName: 'Led',
  validAttributes: {
    pin: true,
    voltage: true,
    mode: true,
  },
};

class Led extends React.Component {
  render() {
    return <Hardware {...this.props} />
  }
}

Led.displayName = 'Led';

var Hardware = createReactHardwareComponentClass(viewConfig);
Hardware.defaultProps = {mode: modes.OUTPUT};

export default Led;

