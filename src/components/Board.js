import React from 'react';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';

var viewConfig = {
  uiViewClassName: 'Board',
  validAttributes: {
    // port: true,
  },
};

class Board extends React.Component {
  render() {
    return (
      <Hardware {...this.props} />
    );
  }
}

var Hardware = createReactHardwareComponentClass(viewConfig);

export default Board;

