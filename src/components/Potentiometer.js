import React from '../ReactHardware';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';
import HardwareManager from '../HardwareManager';
import ReactHardwareEventEmitter from '../ReactHardwareEventEmitter';
import findNodeHandle from '../findNodeHandle';
import {collect, emitEvent} from './ComponentUtils';
import defaultPropTypes from './defaultPropTypes';
var {PropTypes} = React;

var CHANGE_EVENT = 'topChange';

var EVENT_TYPE = collect(
  HardwareManager.customDirectEventTypes,
  CHANGE_EVENT
);

var POT_REF = 'potentiometer';

var viewConfig = {
  uiViewClassName: 'Potentiometer',
  validAttributes: {
    pin: true,
    mode: true,

    onChange: true,
  },
};

class Potentiometer extends React.Component {
  componentDidMount() {
    this.value = 0;
    var nodeHandle = findNodeHandle(this.refs[POT_REF]);
    var read = false;
    // set up the hardware polling
    HardwareManager.read(nodeHandle, newValue => {
      if (newValue !== this.value && Math.abs(newValue - this.value) > this.props.threshold) {
        this.value = newValue;

        emitEvent(this, nodeHandle, CHANGE_EVENT, newValue);
      }
    });
  }

  componentWillUnmount() {
    // TODO: maybe move this destroyer to the HardwareManager
    HardwareManager.destroyRead(findNodeHandle(this.refs[POT_REF]));
  }

  render() {
    var props = {...this.props};

    return (
      <Hardware
        ref={POT_REF}
        mode={modes.ANALOG}
        {...props} />
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


