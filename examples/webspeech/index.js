/**
 * Voice-powered LED.
 * This example blinks the Arduino Uno built-in LED on pin 9 whenever you say
 * the word.
 */
import WS from 'ws';
import React, {Component} from 'react';
import {getPort} from '../port';
import ReactHardware from '../../src';
import './server';

const ws = new WS.Server({port: 8098});

class VoiceControlledApplication extends Component {
  constructor(props, context) {
    super(props, context);

    const MAX = 50;
    const STEP = MAX / 4;
    this.state = {value: 0};
    ws.on('connection', (c) => {
      console.log('Connection received');

      c.on('message', (message) => {
        console.log('received: %s', message);
        switch (message) {
          case 'on': return this.setState({value: MAX});
          case 'off': return this.setState({value: 0});
          case 'dimmer': return this.setState({value: Math.max(this.state.value - STEP, 0)});
          case 'brighter': return this.setState({value: Math.min(MAX, this.state.value + STEP)});
        }
      });

      c.send('Connected to Hardware server');
    });
  }

  render() {
    return (
      <pin
        pin={9}
        value={this.state.value}
        mode={'PWM'}
      />
    );
  }
}

ReactHardware.render(
  <VoiceControlledApplication />,
  getPort(),
  (inst) => {
    console.log('Rendered <%s />', VoiceControlledApplication.name);
  }
);
