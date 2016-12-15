/**
 *
 * @flow
 */

import type {FirmataBoard} from '../types';
import {Board} from 'firmata';

const connectionsByContainer = {};

function setup(port, callback) {
  console.info('Connecting to port "%s"', port);
  const board = new Board(port, (error) => {
    if (error) {
      console.info('Board setup error');
      callback(error);
    } else {
      connectionsByContainer[port] = board;
      callback(null, board);
    }
  });

  board.on('error', (error) => {
    // TODO: look up docs/source code for this
    console.info('Board error event!');
    console.log(error);
  });

  board.on('close', () => {
    console.info('Board in port "%s" closed', port);
    // TODO: unmount React tree automatically when this happens.
    delete connectionsByContainer[port];
  });

}

const HardwareInstanceManager = {
  connect(
    port : ?string,
    callback: (error : ?Error, root : FirmataBoard) => any
  ) {
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

  get(port : ?string) {
    if (port) {
      return connectionsByContainer[port];
    }
  }
};

export default HardwareInstanceManager;

