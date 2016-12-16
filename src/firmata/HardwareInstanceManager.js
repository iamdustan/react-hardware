/**
 *
 * @flow
 */

import {Board} from 'firmata';
import {
  getConnection,
  setupConnection,
  updateConnection,
  teardownConnection,
} from './HardwareManager';

function setup(port, callback) {
  console.info('Connecting to port "%s"', port);
  const board = new Board(port, (error) => {
    if (error) {
      console.info('Board setup error');
      callback(error);
    } else {
      updateConnection(port, board);
      callback(null, board);
    }
  });
  setupConnection(port, board);

  board.on('error', (error) => {
    // TODO: look up docs/source code for this
    console.info('Board error event!');
    console.log(error);
  });

  board.on('close', () => {
    console.info('Board in port "%s" closed', port);
    // TODO: unmount React tree automatically when this happens.
    teardownConnection(port);
  });

}

const HardwareInstanceManager = {
  connect(
    port : ?string,
    callback: (error : ?Error, root : typeof Board) => any
  ) {
    if (port == null) {
      console.info('Requesting port...');
      Board.requestPort((error, port) => {
        console.log(error, port);
        if (error) {
          callback(error);
        } else {
          setup(port.comName, callback);
        }
      });
    } else {
      setup(port, callback);
    }
  },

  get(port : ?string) {
    if (port) {
      const connection = getConnection(port);
      if (connection) {
        return connection.board;
      }
    }
  }
};

export default HardwareInstanceManager;

