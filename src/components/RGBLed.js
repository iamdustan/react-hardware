/* @flow */
import * as React from 'react';
import Led from './Led';

type Props = {
  pins: Array<number>,
  values: Array<number>,
};
const RGBLed = React.memo<React.ComponentType<Props>>(({pins, values}) => (
  <container>
    {pins.map((pin, i) => (
      <Led
        pin={pin}
        value={typeof values[i] !== 'undefined' ? values[i] : values[0]}
        mode={'PWM'}
      />
    ))}
  </container>
));

export default RGBLed;
