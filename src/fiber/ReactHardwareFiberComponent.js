/**
 * @flow
 */

import type {Board} from 'firmata';

// import invariant from 'fbjs/lib/invariant';
import warning from 'fbjs/lib/warning';
import {
  setPayloadForPin,
  validatePayloadForPin
} from '../firmata/HardwareManager';

const assertValidProps = validatePayloadForPin;

type Instance = Object;

// TODO: switch `tag` to pin MODE
/*
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
*/

const ReactHardwareFiberComponent = {
  createElement(
    tag: string,
    props : Object,
    rootContainerElement : Board,
    hostContext : string | null
  ) {
    // Deprecated path for when a `container` is hit which was a hack in stack
    // for being unable to return an array from render.
    if (tag === 'container') {
      warning(false,
        'The <container /> tag has been deprecated and will be removed in ' +
        'the next release. ReactFiber supports returning an array from render()'
      );
      return rootContainerElement;
    }

    // TODO: element should be a data structure that represents the “element”
    return Object.assign({}, props);
  },

  setInitialProperties(
    element : Instance,
    tag : string,
    rawProps : Object,
    rootContainerElement : Board
  ) {
    // Deprecated path for when a `container` is hit which was a hack in stack
    // for being unable to return an array from render.
    if (tag === 'container') {
      return;
    }

    assertValidProps(rootContainerElement, rawProps);
    // this assumes I have an instance of a hardware node...
    Object.assign(element, rawProps);
    setPayloadForPin(rootContainerElement, element);
    // console.log('setInitialProperties', element);
  },

  updateProperties(
    element : Instance,
    tag : string,
    lastRawProps : Object,
    nextRawProps : Object,
    rootContainerElement : Board
  ) {
    // Deprecated path for when a `container` is hit which was a hack in stack
    // for being unable to return an array from render.
    if (tag === 'container') {
      return;
    }

    assertValidProps(rootContainerElement, nextRawProps);
    Object.assign(element, nextRawProps);
    setPayloadForPin(rootContainerElement, element);
    // console.log('updateProperties', element);
  },
};

export default ReactHardwareFiberComponent;

