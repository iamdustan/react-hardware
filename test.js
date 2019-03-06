
import React from 'react';
import Renderer from './src';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: 1};
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({value: this.state.value ? 0 : 1});
    }, 1000);
  }
render() {
    return (
      <pin
        pin={12}
        value={this.state.value}
        mode={'OUTPUT'}
      />
    );
  }
}

const port = (
  process.env.REACT_HARDWARE_EXAMPLE_PORT ||
  process.env.NODE_ENV === 'test'
    ? '/dev/cu.usbmodem1451' : null
);

/*
Renderer.render(
  <pin
    pin={12}
    value={1}
    mode={'OUTPUT'}
  />,
  port
);
*/

Renderer.render(<App />, port);

