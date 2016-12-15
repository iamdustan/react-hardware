/**
 * @flow
 */

import type {FirmataBoard} from './types';
import invariant from 'fbjs/lib/invariant';
import warning from 'fbjs/lib/warning';

// TODO: switch `tag` to pin MODE
const assertValidProps = (
  tag : string,
  rawProps : Object
) => {
  console.log('tag', tag);
  console.log('rawProps', rawProps);
  // TODO: getDeclarationErrorAddendum() and getCurrentOwnerName()
  // should be added to the invariants
  invariant(
    rawProps.pin != null,
    'A pin must be provided'
  );

  invariant(
    rawProps.mode != null,
    'A mode must be provided'
  );

  warning(
    rawProps.value != null,
    'A value should be provided'
  );
};

const ReactHardwareFiberComponent = {
  createElement(
    tag: string,
    props : Object,
    rootContainerElement : FirmataBoard,
    hostContext : string | null
  ) {
    return tag;
  },

  setInitialProperties(
    element : string,
    tag : string,
    rawProps : Object,
    rootContainerElement : FirmataBoard
  ) {
    assertValidProps(tag, rawProps);
    // this assumes I have an instance of a hardware node...
    // updateProperties();
  },

  updateProperties(
    instance : string,
    tag : string,
    lastRawProps : Object,
    nextRawProps : Object,
    rootContainerElement : FirmataBoard
  ) {
    assertValidProps(tag, nextRawProps);
    updateProperties(/* TODO */);
  },
};

export default ReactHardwareFiberComponent;

