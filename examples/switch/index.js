/**
 * An example using the <Switch /> component to toggle an Led on and off.
 */

import {getPort} from '../port';
import ReactHardware from '../../src';
import React, {Component} from 'react';

const {Container, Switch, Led} = ReactHardware;

class SwitchDemo extends Component {
  constructor() {
    super();

    this.state = {switchValue: false};
    this.toggle = (switchValue) => this.setState({switchValue});
  }

  render():ReactElement {
    return (
      <Container>
        <Switch pin={8} onChange={this.toggle} />
        <Led pin={13} mode={'OUTPUT'} value={this.state.switchValue} />
      </Container>
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

