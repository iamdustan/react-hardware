import React from 'react';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';
import HardwareManager from '../HardwareManager';
import findNodeHandle from '../findNodeHandle';
import {collect, emitEvent} from './ComponentUtils';
var {PropTypes} = React;

var CHANGE_EVENT = 'topChange';
var CLOSE_EVENT = 'topClose';
var OPEN_EVENT = 'topOpen';

var EVENT_TYPE = collect(
  HardwareManager.customDirectEventTypes,
  CHANGE_EVENT, CLOSE_EVENT, OPEN_EVENT
);

var SWITCH_REF = 'switch';

var viewConfig = {
  uiViewClassName: 'Switch',
  validAttributes: {
    pin: true,
    mode: true,

    onChange: true,
    onClose: true,
    onOpen: true,
  },
};

class Switch extends React.Component {
  componentDidMount() {
    var nodeHandle = findNodeHandle(this.refs[SWITCH_REF]);
    // set up the hardware polling
    HardwareManager.read(nodeHandle, newValue => {
      if (newValue !== this.value) {
        var eventName = newValue === 0 ? CLOSE_EVENT : OPEN_EVENT;
        emitEvent(this, nodeHandle, eventName, newValue);
        emitEvent(this, nodeHandle, CHANGE_EVENT, newValue);

        this.value = newValue;
      }
    });
  }

  componentWillUnmount() {
    // TODO: maybe move this destroyer to the HardwareManager
    HardwareManager.destroyRead(findNodeHandle(this.refs[SWITCH_REF]));
  }

  render() {
    var props = Object.assign({}, this.props);

    return (
      <Hardware
        ref={SWITCH_REF}
        mode={modes.INPUT}
        {...props} />
    );
  }
}

var Hardware = createReactHardwareComponentClass(viewConfig);

Switch.propTypes = {
  pin: PropTypes.number.isRequired,
  mode: PropTypes.number,

  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

export default Switch;

