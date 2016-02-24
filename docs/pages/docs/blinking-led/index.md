---
title: "Blinking LED"
---

The “Hello World” of hardware programming is typically the blinking LED.
Arduino’s blink tutorial looks like the following:

```c
/*
  Blink
  Turns on an LED on for one second, then off for one second, repeatedly.

  This example code is in the public domain.
 */

// Pin 13 has an LED connected on most Arduino boards.
// give it a name:
int led = 13;

// the setup routine runs once when you press reset:
void setup() {
  // initialize the digital pin as an output.
  pinMode(led, OUTPUT);
}

// the loop routine runs over and over again forever:
void loop() {
  digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);               // wait for a second
  digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);               // wait for a second
}
```

In React Hardware this could be written as follows:

```jsx
/**
 * Blink
 * Turns on an LED on for one second, then off for one second, repeatedly.
 */
import React from 'react';
import ReactArduino from 'react-hardware';

const Blink = React.createClass({
  getInitialState() {
    // value between 0-255
    return {value: 0};
  },

  componentDidMount() {
    this.state._interval = setInterval(() => {
      const voltage = this.state.voltage === 255 ? 0 : 255;
      this.setState({voltage})
    }, 1000);
  },

  componentWillUnmount() {
    clearInterval(this.state._interval);
  },

  render() {
    return <led pin={13} value={this.state.value} type="OUTPUT" />;
  }
});

ReactHardware.render(<Blink />, '/dev/cu.usbmodem1411');
```

Which—let’s be honest—is a rather verbose way of writing that. The beauty of it
is that we can now use our React Component knowledge to make our LEDs composable.

```jsx
/**
 * FlashingLEDs
 * Turns on an LED on for one second, then off for one second, repeatedly.
 */
import React, {Component} from 'react';
import ReactArduino, {Board} from 'react-hardware';

// ES6 React.Components work as you'd expect
class FlashingLED extends Component {
  static defaultProps = {
    interval: 1000,
    delay: 0
  };

  constructor(props) {
    super(props);

    this.state  = {value: this.state.initialValue};
  }

  componentDidMount() {
    var start = () => {
      this.state._interval = setInterval(() => {
        var value = this.state.value === 255 ? 0 : 255;
        this.setState({value}),
      }, this.props.interval);
    };

    setTimeout(start, this.props.delay);
  }

  componentWillUnmount() {
    clearInterval(this.state._interval);
  }

  render() {
    return <led pin={this.props.pin} value={this.state.value} type="OUTPUT" />;
  }
});

// React's stateless components also work here
const Program = () => (
  <Board>
    <FlashingLED pin={13} interval={1000} />
    <FlashingLED pin={14} interval={1000} delay={500} />
  </Board>
)

ReactHardware.render(<Program />, '/dev/cu.usbmodem1411');
```

