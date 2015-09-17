/** @flow */
import React, {Component, PropTypes} from '../ReactHardware';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';
import HardwareManager from '../HardwareManager';
import findNodeHandle from '../findNodeHandle';
import {emitEvent} from './ComponentUtils';
import defaultPropTypes from './defaultPropTypes';

var DOWN_EVENT = 'topDown';
var UP_EVENT = 'topUp';
var CHANGE_EVENT = 'topChange';
var HOLD_EVENT = 'topHold';

var BUTTON_REF = 'button';

var viewConfig = {
  uiViewClassName: 'Button',
  validAttributes: {
    pin: true,
    mode: true,

    onHold: true,
    onChange: true,
    onDown: true,
    onUp: true,
  },
};

class Button extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isDown: false,
      inverted: props.inverted || false,
    };
  }

  componentWillMount() {
    // random private data that shouldn’t trigger a render
    this._timer = null;
  }

  componentDidMount() {
    // set up the hardware polling
    var nodeHandle = findNodeHandle(this.refs[BUTTON_REF]);
    HardwareManager.read(nodeHandle, newValue => {
      if (newValue !== this.value) {
        this.value = newValue;

        // TODO: add support for inverted buttons like johnny-five.
        var eventName = newValue === 0 ? UP_EVENT : DOWN_EVENT;
        emitEvent(this, nodeHandle, eventName, newValue);
        emitEvent(this, nodeHandle, CHANGE_EVENT, newValue);

        if (eventName === DOWN_EVENT) {
          this._timer = setTimeout(
            _ => emitEvent(this, nodeHandle, HOLD_EVENT, newValue),
            this.props.holdtime
          );
        }
        else {
          this._timer = clearTimeout(this._timer);
        }
      }
    });
  }

  componentWillUnmount() {
    // TODO: maybe move this destroyer to the HardwareManager
    HardwareManager.destroyRead(findNodeHandle(this.refs[BUTTON_REF]));
  }

  render() {
    var props = {...this.props};

    return (
      <Hardware
        ref={BUTTON_REF}
        mode={modes.INPUT}
        {...props} />
    );
  }
}

var Hardware = createReactHardwareComponentClass(viewConfig);

Button.propTypes = {
  ...defaultPropTypes,

  holdtime: PropTypes.number,
  onChange: PropTypes.func,
  onDown: PropTypes.func,
  onHold: PropTypes.func,
  onUp: PropTypes.func,
};

Button.defaultProps = {
  holdtime: 1000,
};

export default Button;

