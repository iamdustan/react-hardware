import {Board} from 'firmata';
import ReactHardwareMount from './ReactHardwareMount';
import ReactHardwareTagHandles from './ReactHardwareTagHandles';
import warning from 'react/lib/warning';

var WRITE_TYPE = {
  [0x00]: 'analog', // input
  [0x01]: 'digital', //output
  [0x02]: 'analog', // analog
  [0x03]: 'analog', // pwm
  [0x04]: 'analog', // servo
};


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
    console.log('TODO: HardwareManager#manageChildren');
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
        name === 'Board',
        'A component must have a pin to be rendered. %s', name
      );
      return;
    }

    var {board} = Registry;

    Registry.children[tag] = {
      name: name,
      props: payload,
    },

    // TODO: support more payload modes?
    board[`${WRITE_TYPE[payload.mode]}Write`](payload.pin, payload.voltage);
  },

  updateView(
    tag: number,
    name: string,
    payload: Object
  ) {
    var board = Registry.board;

    var {
      name,
      props,
    } = Registry.children[tag];


    // TODO: Make this much less ugly
    if (typeof payload.mode !== 'undefined') {
      board.pinMode(props.pin, payload.mode);
      props.mode = payload.mode;
    }

    if (typeof payload.voltage !== 'undefined') {
      board[`${WRITE_TYPE[props.mode]}Write`](props.pin, payload.voltage);
    }

    Object.assign(props, payload);
  },
};

export default HardwareManager;

