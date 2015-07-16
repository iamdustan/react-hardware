/** @flow */

import React, {Component, PropTypes} from '../ReactHardware';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';

var viewConfig = {
  uiViewClassName: 'Board',
  validAttributes: {
    pinMapping: true,
    port: true,
  },
};

class Board extends Component {
  render() {
    return (
      <Hardware {...this.props} />
    );
  }
}

Board.propTypes = {
  pinMapping: PropTypes.object.isRequired,
};

var Hardware = createReactHardwareComponentClass(viewConfig);

export default Board;

