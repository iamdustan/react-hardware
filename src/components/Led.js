import React from 'react';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';

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
    return <Hardware {...this.props} />;
  }
}

Led.displayName = 'Led';

var Hardware = createReactHardwareComponentClass(viewConfig);

export default Led;

