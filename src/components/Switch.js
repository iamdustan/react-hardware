import React from 'react';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';
import HardwareManager from '../HardwareManager';
import ReactHardwareEventEmitter from '../ReactHardwareEventEmitter';
import findNodeHandle from '../findNodeHandle';
var {PropTypes} = React;

var CHANGE_EVENT = 'topChange';
var CLOSE_EVENT = 'topClose';
var OPEN_EVENT = 'topOpen';

var collect = (obj, ...things) =>
  things.reduce((memo, thing) => ((memo[thing] = obj[thing]), memo), {});

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

function emitEvent(componentInstance, eventName, value) {
  ReactHardwareEventEmitter.receiveEvent(
    findNodeHandle(componentInstance),
    eventName,
    {
      value: value,
      target: componentInstance,
      type: EVENT_TYPE[eventName].registrationName,
    }
  );
}

class Switch extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isDown: false,
      inverted: props.inverted || false,
    };
  }

  componentDidMount() {
    var value = null;
    // set up the hardware polling
    HardwareManager.read(findNodeHandle(this.refs[SWITCH_REF]), newValue => {
      if (newValue !== value) {
        var eventName = newValue === 0 ? CLOSE_EVENT : OPEN_EVENT;
        emitEvent(this, eventName, newValue);
        emitEvent(this, CHANGE_EVENT, newValue);

        value = newValue;
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
  onDown: PropTypes.func,
  onHold: PropTypes.func,
  onUp: PropTypes.func,
};

export default Switch;

