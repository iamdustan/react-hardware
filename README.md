# React Hardware

> You are on the *rewrite* branch of an *alpha* software project. That should
> tell you something about what to expect happening here. :)

React Hardware enables you to build firmata-based hardware applications using a
consistent developer experience based on JavaScript and React. The focus of
React Hardware is on developer efficiency across all the platforms you care
about - learn once, write anywhere.

**React Hardware is a IoT and Robotics programming framework developed by Dustan
Kasten. Being based on firmata, it is capable of providing feature parity with
alternative tools such as Johnny-Five.**

Note that this is currently alpha software and hasn’t been tested or have many
features implemented. It currently supports firmata’s `digitalWrite` and
`analogWrite` methods. Full support for firmata is coming including an event
system to receive feedback from the board and manipulate state as a result of
that.

## Hello World

The "Hello World" program of microcontrollers is to "blink an LED". The
following code demonstrates how this is done naively with React Hardware and how
React’s programming model brings composability to the hardware world.

``` javascript
import React from 'react';
import ReactHardware, {Led} from 'react-hardware';

const HIGH = 255;
const LOW = 0;

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      _timer: null,
    };
  }

  componentDidMount() {
    this.state._timer = setInterval(_ => (
      this.setState({value: this.state.value === HIGH ? LOW : HIGH})
    ), this.props.interval);
  }

  render() {
    return (
      <Led pin={10} value={this.state.value} />
    );
  }
}

var PORT = '/dev/tty.usbmodem1411';
ReactHardare.render(<Application />, PORT);
```

While this is unquestionably more code than it’s Johnny-Five or Sketch
equivalents, this now gives you the ability to extract the parts of your board
into self-contained components and compose these together. In this application
we introduced the concept of a flashing LED, hard-coded naively into the global
state. Let’s now extract the idea of a flashing LED into something we can share
with our team or even on npm.

``` javascript
import React from 'react';
import ReactHardware, {Board, Led} from 'react-hardware';

const HIGH = 255;
const LOW = 0;

class FlashingLed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      _timer: null,
    };
  }

  componentDidMount() {
    this.state._timer = setInterval(_ => (
      this.setState({value: this.state.value === HIGH ? LOW : HIGH})
    ), this.props.interval);
  }

  render() {
    return (
      <Led {...this.props} value={this.state.value} />
    );
  }
}

class Application extends React.Component {
  render() {
    return (
      <Board>
        <FlashingLed pin={9} />
        <FlashingLed pin={10} />
        <FlashingLed pin={11} />
        <FlashingLed pin={12} />
      </Board>
    );
  }
}

var PORT = '/dev/tty.usbmodem1411';
ReactHardware.render(<Application />, PORT);
```

## Community

There should be #react-hardware channels created on both
https://reactiflux.com/ and IRC.

## Contributing

The codebase is written in es6 with (sporadic) types and compiled with babel.
Follow the existing style when creating changes. Eslint and the flow type
checker will be set up shortly. While the project is under heavy active
development it would be useful to make an issue discussing your change before
making a PR to ensure we aren’t duplicating effort.

## License

Copyright (c) 2015 Dustan Kasten | dustan.kasten@gmail.com
Licensed under the MIT license.

