/**
 * https://github.com/keithpops/jeoparty in React Hardware
 */
import React from 'react';
import ReactHardware from '../../src';
import {getPort} from '../port';
// import socket from 'socket.io';

// socket.io config
// const io = socket(server);
const {
  Container,
  Button,
} = ReactHardware;

class JeopartyLed extends React.Component {
  constructor() {
    super();

    this.state = {value: 0};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'on') {
      this.setState({value: 1});
    } else if (nextProps.status === 'off') {
      this.setState({value: 0});
    } else if (nextProps.status === 'strobe') {
      this._interval = setInterval(_ => {
        this.setState({value: !this.state.value});
      }, 40);
      setTimeout(_ => {
        clearInterval(this._interval);
        this._interval = null;
      }, 210);
    }
  }

  render() {
    return (
      <led
        {...this.props}
        {...this.state}
      />
    );
  }
}

class Jeoparty extends React.Component {
  constructor() {
    super();

    this.state = {
      led1: 'off',
      led2: 'off',
      led3: 'off',
    };

    this._socket = null;
  }

  onClick(player, value) {
    this._socket.emit('rec', {player});
  }

  componentDidMount() {
    // on a socket connection
    io.sockets.on('connection', (socket) => {
      // Player Button LEDs
      // strobe
      socket.on('led-strobe-1', () => this.setState({led1: 'strobe'}));
      socket.on('led-strobe-2', () => this.setState({led2: 'strobe'}));
      socket.on('led-strobe-3',  () => this.setState({led3: 'strobe'}));

      // on
      socket.on('led-on-all', () => {
        this.setState({
          led1: 'on',
          led2: 'on',
          led3: 'on',
        });
      });

      socket.on('led-on-1', () => this.setState({led1: 'on'}));
      socket.on('led-on-2', () => this.setState({led2: 'on'}));
      socket.on('led-on-3', () => this.setState({led3: 'on'}));

      // off
      socket.on('led-off-1', () => this.setState({led1: 'off'}));
      socket.on('led-off-2', () => this.setState({led2: 'off'}));
      socket.on('led-off-3', () => this.setState({led3: 'off'}));


      // All LED Strobe
      socket.on("led-strobe-all", function () {
        this.setState({led1: 'strobe'});
        setTimeout(_ => {
          this.setState({led2: 'strobe'});
        }, 70);
        setTimeout(_ => {
          this.setState({led3: 'strobe'});
        }, 140);
      });


      // LED off
      socket.on('led-stop', () => {
        this.setState({
          led1: 'off',
          led2: 'off',
          led3: 'off',
        });
      });
    });
  }

  render() {
    return (
      <Container>
        <JeopartyLed pin={3} status={this.state.led1} />
        <JeopartyLed pin={6} status={this.state.led2} />
        <JeopartyLed pin={9} status={this.state.led3} />

        <Button pin={2} onUp={this.onClick.bind(this, 1)} />
        <Button pin={5} onUp={this.onClick.bind(this, 2)} />
        <Button pin={8} onUp={this.onClick.bind(this, 3)} />
      </Container>
    );
  }
}

ReactHardware.render(
  <Jeoparty />
  getPort(),
  (inst) => {
    console.log('Rendered <Jeoparty />');
  }
);

