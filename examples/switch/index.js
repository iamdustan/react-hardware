/**
 * An example using the <Switch /> component to toggle an Led on and off.
 */

import React, {Component} from 'react';
import {getPort} from '../port';
import ReactHardware, {Switch, Led} from '../../src';

class SwitchDemo extends Component {
  constructor() {
    super();

    this.state = {switchValue: false};
    this.toggle = (switchValue) => this.setState({switchValue});
  }

  render() {
    return (
      <container>
        <Switch pin={8} onChange={this.toggle} />
        <Led pin={13} mode={'OUTPUT'} value={this.state.switchValue} />
      </container>
    );
  }
}

ReactHardware.render(
  <SwitchDemo />,
  getPort(),
  (inst) => {
    console.log('Rendered <SwitchDemo />');
  }
);
