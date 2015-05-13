import React from 'react';
import ReactHardware from '../';

const {
  Board,
  Led,
} = ReactHardware;

const HIGH = 255;
const LOW = 0;

class Application extends React.Component {
  render(): ?ReactElement {
    return (
      <Board>
        <Led pin={13} voltage={this.props.voltage} />
      </Board>
    );
  }
}

ReactHardware.render(<Application voltage={HIGH} />, '/dev/cu.usbmodem1411', _ => (
  console.log('ReactHardware mounted'/*, arguments*/)
));

setTimeout(_ =>
  ReactHardware.render(
    <Application voltage={LOW} />,
    '/dev/cu.usbmodem1411',
    _ => console.log('ReactHardware mounted')
  ), 2000
);

setTimeout(_ =>
  ReactHardware.render(
    <Application voltage={HIGH} />,
    '/dev/cu.usbmodem1411',
    _ => console.log('ReactHardware mounted')
  ), 4000
);

