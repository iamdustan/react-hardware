/* @flow */

import React, {Component, PropTypes} from '../ReactHardware';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';
import HardwareManager from '../HardwareManager';
import findNodeHandle from '../findNodeHandle';
import {emitEvent} from './ComponentUtils';
import defaultPropTypes from './defaultPropTypes';

var CHANGE_EVENT = 'topChange';
var POT_REF = 'potentiometer';

var viewConfig = {
  uiViewClassName: 'Potentiometer',
  validAttributes: {
    pin: true,
    mode: true,

    onChange: true,
  },
};

class Potentiometer extends Component {
  componentDidMount():void {
    this.value = 0;
    var nodeHandle = findNodeHandle(this.refs[POT_REF]);
    // set up the hardware polling
    HardwareManager.read(nodeHandle, newValue => {
      if (newValue !== this.value && Math.abs(newValue - this.value) > this.props.threshold) {
        this.value = newValue;

        emitEvent(this, nodeHandle, CHANGE_EVENT, newValue);
      }
    });
  }

  componentWillUnmount():void {
    // TODO: maybe move this destroyer to the HardwareManager
    HardwareManager.destroyRead(findNodeHandle(this.refs[POT_REF]));
  }

  render():ReactElement {
    return (
      <Hardware
        ref={POT_REF}
        mode={modes.ANALOG}
        {...this.props} />
    );
  }
}

var Hardware = createReactHardwareComponentClass(viewConfig);

Potentiometer.defaultProps = {
  threshold: 10,
};

Potentiometer.propTypes = {
  ...defaultPropTypes,

  threshold: PropTypes.number,
  onChange: PropTypes.func,
};

export default Potentiometer;

