/*eslint no-console:0*/
import {Board} from 'firmata';
import ReactHardwareMount from './ReactHardwareMount';
// import ReactHardwareTagHandles from './ReactHardwareTagHandles';
import warning from 'react/lib/warning';
import invariant from 'react/lib/invariant';

var WRITE_TYPE = {
  [0x00]: 'digital', // input
  [0x01]: 'digital', //output
  [0x02]: 'analog', // analog
  [0x03]: 'analog', // pwm
  [0x04]: 'servo',  // servo
};

var Registry = {
  children: {},
};

var EMPTY_ARRAY = [];

function _childrenToRemoveFromContainer(container, atIndices) {
  // If there are no indices to move or the container has no subviews don't bother
  // We support parents with nil subviews so long as they're all nil so this allows for this behavior
  if (!atIndices || atIndices.length === 0) {
    return null;
  }
  // Construction of removed children must be done "up front", before indices are disturbed by removals.
  var removedChildren = new Array(atIndices.length);

  invariant(container !== null, 'container view (for ID %s) not found', container);

  var i, index;
  for (var i = 0; i < atIndices.length; i++) {
    index = atIndices[i];
    if (index < Object.keys(Registry.children).length) {
      removedChildren.push(Registry.children[index]);
    }
  }
  warning(
    removedChildren.length !== atIndices.length,
    'removedChildren count (%s) was not what we expected (%s)',
    removedChildren.count,
    atIndices.count
  );
  return removedChildren;
}

/**
 * Unregisters views from registries
 */
function _purgeChildren(children, fromRegistry) {
  for (var child in children) {
    console.log('_purgeChildren', child);
    fromRegistry[child.reactTag] = null;
  }
}

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
    moveFromIndices, // null
    moveToIndices,   // null
    addChildTags,
    addAtIndices,
    removeAtIndices
  ) {
    console.log(
      'TODO: HardwareManager#manageChildren',
      componentTag,
      moveFromIndices,
      moveToIndices,
      addChildTags,
      addAtIndices,
      removeAtIndices
    );
    var {children} = Registry;

    if (moveFromIndices || moveToIndices) throw new Error('Components should never move in the hardware tree');

    var permanentlyRemovedChildren = _childrenToRemoveFromContainer(componentTag, removeAtIndices) || EMPTY_ARRAY;
    var temporarilyRemovedChildren = _childrenToRemoveFromContainer(componentTag, moveFromIndices) || EMPTY_ARRAY;

    console.log('permanentlyRemovedChildren', permanentlyRemovedChildren);
    console.log('temporarilyRemovedChildren', temporarilyRemovedChildren);
    permanentlyRemovedChildren.forEach(child => (
      console.log(
        'ReactHardwareMount.unmountComponentAtNode(%s)',
        child,
        ReactHardwareMount.unmountComponentByTag(child)
      )
    ));

    /*
    Removes (both permanent and temporary moves) are using "before" indices
    [self _removeChildren:permanentlyRemovedChildren fromContainer:container];
    [self _removeChildren:temporarilyRemovedChildren fromContainer:container];
    */

    _purgeChildren(permanentlyRemovedChildren, children);

    // Figure out what to insert - merge temporary inserts and adds
    var destinationsToChildrenToAdd = {};
    var index, length, view;
    for (index = 0, length = temporarilyRemovedChildren.length; index < length; index++) {
      destinationsToChildrenToAdd[moveToIndices[index]] = temporarilyRemovedChildren[index];
    }
    for (index = 0, length = addAtIndices.length; index < length; index++) {
      view = Registry.children[addChildTags[index]];
      if (view) {
        destinationsToChildrenToAdd[addAtIndices[index]] = view;
      }
    }
    console.log('destinationsToChildrenToAdd', destinationsToChildrenToAdd);

    var sortedIndices = Object.keys(destinationsToChildrenToAdd).sort();
    for (var reactIndex in sortedIndices) {
      // console.log('reactIndex', reactIndex, sortedIndices[reactIndex]);
      // [container insertReactSubview:destinationsToChildrenToAdd[reactIndex] atIndex:reactIndex.integerValue];
    }
  },

  destroyView(
    tag: number,
    name: string
  ) {
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

    // var view = Registry.children[tag];
    // console.log('view', view, tag, Registry.children);
    Registry.children[tag] = {
      name: name,
      props: payload,
    };

    // TODO: support more payload modes?
    Registry.board.pinMode(payload.pin, payload.mode);

    Registry.board[`${WRITE_TYPE[payload.mode]}Write`](payload.pin, payload.value);
  },

  updateView(
    tag: number,
    _name: string,
    payload: Object
  ) {

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


    if (typeof payload.value !== 'undefined') {
      // console.log(`${WRITE_TYPE[props.mode]}Write`, props.pin, payload.value);
      Registry.board[`${WRITE_TYPE[props.mode]}Write`](props.pin, payload.value);
    }

    Object.assign(props, payload);
  },

  read(tag: number, callback: Function) {
    var {
      props,
      reader,
    } = Registry.children[tag];

    Registry.board[`${WRITE_TYPE[props.mode]}Read`](props.pin, callback);
  },

  setJSResponder(tag: number) {
    console.log('TODO: HardwareManager#setJSResponder to %s', tag);
  },

  clearJSResponder() {
    console.log('TODO: HardwareManager#clearJSResponder');
  },

  customDirectEventTypes: {
    topChange: {registrationName: 'onChange'},
    topDown: {registrationName: 'onDown'},
    topUp: {registrationName: 'onUp'},
    topHold: {registrationName: 'onHold'},
  },
};

export default HardwareManager;

