/**
 * @flow
 */

import type {Board} from 'firmata';

import invariant from 'fbjs/lib/invariant';
import warning from 'fbjs/lib/warning';

// TODO: switch `tag` to pin MODE
const assertValidProps = (
  tag : string,
  rawProps : Object
) => {
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
    // TODO: element should be a data structure that represents the “element”
    return props;
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

