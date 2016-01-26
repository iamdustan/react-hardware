/** @flow */
import React, {PropTypes, Component} from 'react';
import Led from './Led';

/*
var viewConfig = {
  uiViewClassName: 'RGBLed',
  validAttributes: {
    pins: true,
    values: true
  },
};
*/

class RGBLed extends Component {
  render() {
    const {
      pins,
      values,
    } = this.props;

    return (
      <container>
        {pins.map((pin, i) => (
          <Led
            pin={pin}
            value={typeof values[i] !== 'undefined' ? values[i] : values[0]}
            mode={'PWM'}
          />
        ))}
      </container>
    );
  }
}

RGBLed.propTypes = {
  pins: PropTypes.arrayOf(PropTypes.number).isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
};
// Led.displayName = 'Led';

// var Hardware = createReactHardwareComponentClass(viewConfig);

export default RGBLed;


