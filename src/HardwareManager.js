/*eslint no-console:0*/
import {Board} from 'firmata';
// import ReactHardwareTagHandles from './ReactHardwareTagHandles';
import warning from 'react/lib/warning';
import invariant from 'react/lib/invariant';

var WRITE_TYPE = {
  [0x00]: 'analog',  // input
  [0x01]: 'digital', //output
  [0x02]: 'analog', // analog
  [0x03]: 'analog', // pwm
  [0x04]: 'servo',  // servo
};

var Registry = {
  children: [],
};

var noop = () => {};
var HardwareManager = {
  createConnection(containerTag, callback = noop) {
    var onConnect = (err) => {
      if (err) {
        throw err;
      }
      console.log('Connected to %s', containerTag);
      Registry[containerTag].isConnected = true;
      Registry[containerTag].onReadyQueue.forEach(fn => fn());
      callback();
    };

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
        'A component `%s` must have a pin to render.', name
      );
      return;
    }

    Registry.children[tag] = {
      name: name,
      props: payload,
    };

    // TODO: support more payload modes?
    Registry.board.pinMode(payload.pin, payload.mode);

    console.log(`${WRITE_TYPE[payload.mode]}Write`, payload.pin, payload.voltage);
    Registry.board[`${WRITE_TYPE[payload.mode]}Write`](payload.pin, payload.voltage);
  },

  updateView(
    tag: number,
    _name: string,
    payload: Object
  ) {

    console.log('write to %s %s', tag, _name, payload.voltage);

    var {
      name,
      props,
    } = Registry.children[tag];

    invariant(
      name === _name,
      'It appears like you’re trying to update a view in pin %s to a new ' +
      'component type.',
      tag, name, _name
    );

    // TODO: Make this much less ugly
    if (typeof payload.mode !== 'undefined') {
      Registry.board.pinMode(props.pin, payload.mode);
      props.mode = payload.mode;
    }


    if (typeof payload.voltage !== 'undefined') {
      console.log(`${WRITE_TYPE[props.mode]}Write`, props.pin, payload.voltage);
      Registry.board[`${WRITE_TYPE[props.mode]}Write`](props.pin, payload.voltage);
    }

    Object.assign(props, payload);
  },
};

export default HardwareManager;

