import React from 'react';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';

var viewConfig = {
  uiViewClassName: 'Led',
  validAttributes: {
    pin: true,
    voltage: true,
  },
};

class Led extends React.Component {
  render() {
    // console.log('Should be connected to board somehow');
    return <Hardware {...this.props} />
  }
}

Led.displayName = 'Led';

var Hardware = createReactHardwareComponentClass(viewConfig);

export default Led;

