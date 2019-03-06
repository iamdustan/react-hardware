/** @flow */
import * as React from 'react';
import Led from './Led';

type Props = {
  pins: Array<number>,
  values: Array<number>,
};
class RGBLed extends React.PureComponent<Props> {
  render() {
    const {pins, values} = this.props;

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

/*
RGBLed.propTypes = {
  pins: PropTypes.arrayOf(PropTypes.number).isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired
};
*/

export default RGBLed;
