import {Board} from 'firmata';
import ReactHardwareMount from './ReactHardwareMount';
import ReactHardwareTagHandles from './ReactHardwareTagHandles';
import warning from 'react/lib/warning';

var Registry = {
  children: [],
};

var HardwareManager = {
  createConnection(containerTag, callback = (() => {})) {
    var onConnect = (err) => {
      if (err) {
        throw err;
      }
      console.log('Connected to %s', containerTag);
      Registry[containerTag].isConnected = true;
      Registry[containerTag].onReadyQueue.forEach(fn => fn());
      callback();
    }

    if (Registry[containerTag]) {
      if (Registry[containerTag].isConnected) {
        callback();
      }
    }
    else {
      Registry[containerTag] = {
        board: new Board(containerTag, onConnect),
        isReady: false,
        onReadyQueue: [],
        children: [],
      };

      Registry.board = Registry[containerTag].board;
    }

    return Registry[containerTag];
  },

  manageChildren(
    componentTag,
    // TODO (remove): most of these are unnecessary in the hardware environment
    moveFromIndices,
    moveToIndices,
    addChildTags,
    addAtIndices,
    removeAtIndices
  ) {
    console.log('TODO: manageChildren');
    // console.log('TODO: manageChildren', arguments);
    // console.log(Registry[componentTag]);
  },

  createView(
    tag: number,
    name: string,
    payload: Object
  ) {
    if (!payload || typeof payload.pin === 'undefined') {
      warning(
        name !== 'Board',
        'A component must have a pin to be rendered. %s'
      );
      return;
    }

    var board = Registry.board;

    Registry.children[tag] = {
      name: name,
      props: payload,
    },

    // TODO: support more boards;
    board.pinMode(payload.pin, board.MODES.OUTPUT);
    board.digitalWrite(payload.pin, payload.voltage);
  },

  updateView(
    tag: number,
    name: string,
    payload: Object
  ) {
    if (payload.port) { return; /* connectToBoard */ }
    var board = Registry.board;

    var {
      name,
      props,
    } = Registry.children[tag];

    // TODO: support more boards
    board.pinMode(props.pin, board.MODES.OUTPUT);
    board.digitalWrite(props.pin, payload.voltage);
    Object.assign(props, payload);
  },
};

export default HardwareManager;

