import React from 'react';
import createReactHardwareComponentClass from '../createReactHardwareComponentClass';
import modes from './inputModes';
import HardwareManager from '../HardwareManager';
import ReactHardwareEventEmitter from '../ReactHardwareEventEmitter';
import findNodeHandle from '../findNodeHandle';
var {PropTypes} = React;

var CHANGE_EVENT = 'topChange';

var collect = (obj, ...things) =>
  things.reduce((memo, thing) => ((memo[thing] = obj[thing]), memo), {});

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

class Potentiometer extends React.Component {
  componentDidMount() {
    // set up the hardware polling
    HardwareManager.read(findNodeHandle(this.refs[POT_REF]), newValue => {
      if (newValue !== this.value && Math.abs(newValue - this.value) > this.props.threshold) {
        emitEvent(this, CHANGE_EVENT, newValue);

        this.value = newValue;
      }
    });
  }

  componentWillUnmount() {
    // TODO: maybe move this destroyer to the HardwareManager
    HardwareManager.destroyRead(findNodeHandle(this.refs[POT_REF]));
  }

  render() {
    var props = Object.assign({}, this.props);

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
  pin: PropTypes.number.isRequired,
  mode: PropTypes.number,
  threshold: PropTypes.number,

  onChange: PropTypes.func,
};

export default Potentiometer;


