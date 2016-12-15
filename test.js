
import React from 'react';
import Renderer from './src/ReactHardwareFiber';

console.log(
  Renderer.render(
    <pin
      pin={12}
      value={1}
      mode={'OUTPUT'}
    /> //,
    // process.env.REACT_HARDWARE_EXAMPLE_PORT || '/dev/cu.usbmodem1451'
  )
);

