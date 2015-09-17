/** @flow */
import React, {Component, PropTypes} from '../ReactHardware';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';
import HardwareManager from '../HardwareManager';
import findNodeHandle from '../findNodeHandle';
import {emitEvent} from './ComponentUtils';
import defaultPropTypes from './defaultPropTypes';

var CHANGE_EVENT = 'topChange';
var CLOSE_EVENT = 'topClose';
var OPEN_EVENT = 'topOpen';

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

class Switch extends Component {
  componentDidMount():void {
    var nodeHandle = findNodeHandle(this.refs[SWITCH_REF]);
    // set up the hardware polling
    HardwareManager.read(nodeHandle, newValue => {
      if (newValue !== this.value) {
        this.value = newValue;

        var eventName = newValue === 0 ? CLOSE_EVENT : OPEN_EVENT;
        emitEvent(this, nodeHandle, eventName, newValue);
        emitEvent(this, nodeHandle, CHANGE_EVENT, newValue);
      }
    });
  }

  componentWillUnmount():void {
    // TODO: maybe move this destroyer to the HardwareManager
    HardwareManager.destroyRead(findNodeHandle(this.refs[SWITCH_REF]));
  }

  render():ReactElement {
    return (
      <Hardware
        ref={SWITCH_REF}
        mode={modes.INPUT}
        {...this.props} />
    );
  }
}

var Hardware = createReactHardwareComponentClass(viewConfig);

Switch.propTypes = {
  ...defaultPropTypes,

  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

export default Switch;

