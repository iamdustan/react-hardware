/*eslint no-console:0*/
import React from '../';

const {
  Board,
  Led,
} = React;

const HIGH = 255;
const LOW = 0;

class Application extends React.Component {
  render(): ?ReactElement {
    return (
      <Board>
        <Led pin={9} voltage={this.props.voltage} />
      </Board>
    );
  }
}

var PORT = '/dev/tty.usbmodem1411';
React.render(<Application voltage={HIGH} />, PORT, _ => {
  setTimeout(_ =>
    React.render(
      <Application voltage={LOW} />,
      PORT,
      _ => console.log('ReactHardware mounted')
    ), 2000
  );

  setTimeout(_ =>
    React.render(
      <Application voltage={HIGH} />,
      PORT,
      _ => console.log('ReactHardware mounted')
    ), 4000
  );
});

