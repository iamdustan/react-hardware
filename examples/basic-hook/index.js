/**
 * Blinking LED.
 * This example blinks the Arduino Uno built-in LED on pin 13 every 1 second.
 */

import * as React from 'react';
import {getPort} from '../port';
import ReactHardware from '../../src';

// thanks Dan. https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const FlashingLedHook = () => {
  const [value, setState] = React.useState(1);
  useInterval(() => setState(value === 0 ? 1 : 0), 1000);

  return <pin pin={13} value={value} mode={'OUTPUT'} />;
};

ReactHardware.render(<FlashingLedHook />, getPort(), inst => {
  console.log('Rendered <%s />', 'FlashingLedHook');
});
