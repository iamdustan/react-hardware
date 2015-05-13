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
      <Board port="/dev/tty-usbserial1">
        <Led {...this.props} voltage={this.props.voltage} />
      </Board>
    );
  }
}

ReactHardware.render(<Application props={HIGH} />, '/dev/tty-usbserial1', _ => (
  console.log('ReactHardware mounted'/*, arguments*/)
));

setTimeout(_ =>
  ReactHardware.render(
    <Application voltage={LOW} />,
    '/dev/tty-usbserial1',
    _ => console.log('ReactHardware mounted')
  ), 2000
);

setTimeout(_ =>
  ReactHardware.render(
    <Application voltage={HIGH} />,
    '/dev/tty-usbserial1',
    _ => console.log('ReactHardware mounted')
  ), 4000
);

