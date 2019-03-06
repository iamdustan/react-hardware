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

const isBoardish = thing =>
  thing.hasOwnProperty('id') &&
  thing.hasOwnProperty('repl') &&
  thing.hasOwnProperty('pins');

function setup(port, callback) {
  if (isBoardish(port)) {
    const board: Board = (port: any);
    console.warn(
      'It looks like you’re passing a Johnny-five board in. This is ' +
        'experimental at best. Have fun! :)',
    );
    setupConnection('experimental-board', board);
    board.on('ready', error => {
      if (error) {
        callback(error);
      } else {
        updateConnection('experimental-board', board);
        callback(null, board);
      }
    });
    return;
  }

  console.info('Connecting to port "%s"', port);
  const board = new Board(port, (error, b) => {
    if (error) {
      console.info('Board setup error');
      callback(error);
    } else {
      console.log('updateConnection', port, error, b);
      updateConnection(port, board);
      callback(null, board);
    }
  });
  setupConnection(port, board);

  board.on('error', error => {
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

type Result<T, E> = (error: E | null, value?: T) => void;
// | (error : null, root: T) => void;

const HardwareInstanceManager = {
  connect(port: ?string, callback: Result<Board, Error>) {
    if (port == null) {
      console.info('Requesting port...');
      Board.requestPort((error, port) => {
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

  get(port: ?string) {
    if (port) {
      const connection = getConnection(port);
      if (connection) {
        return connection.board;
      }
    }
    return null;
  },
};

export default HardwareInstanceManager;
