/**
 * @flow
 */

import type {Board} from 'firmata';

// import invariant from 'invariant';
import warning from 'warning';
import {
  setPayloadForPin,
  validatePayloadForPin,
} from '../firmata/HardwareManager';

const assertValidProps = validatePayloadForPin;
import {create, diff} from '../attributePayload';
type Instance = Object;
type Props = Object;

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

const IO_KEY = '__IO__';

const ReactHardwareFiberComponent = {
  createElement(
    tag: string,
    props: Object,
    rootContainerElement: Board,
    hostContext: string | null,
  ) {
    // Deprecated path for when a `container` is hit which was a hack in stack
    // for being unable to return an array from render.
    if (tag === 'container') {
      warning(
        false,
        'The <container /> tag has been deprecated and will be removed in ' +
          'the next release. ReactFiber supports returning an array from render()',
      );
      return rootContainerElement;
    }

    // TODO: element should be a data structure that represents the “element”
    return Object.assign({[IO_KEY]: rootContainerElement}, props);
  },

  setInitialProperties(
    element: Instance,
    tag: string,
    rawProps: Object,
    rootContainerElement: Board,
  ) {
    // Deprecated path for when a `container` is hit which was a hack in stack
    // for being unable to return an array from render.
    if (tag === 'container') {
      return;
    }

    console.log(
      'setInitialProperties',
      element,
      tag,
      rawProps,
      rootContainerElement,
    );
    assertValidProps(rootContainerElement, rawProps);
    // this assumes I have an instance of a hardware node...
    Object.assign(element, rawProps);
    setPayloadForPin(rootContainerElement, element);
    // console.log('setInitialProperties', element);
  },

  diffProperties(
    element: Instance,
    tag: string,
    lastRawProps: Object,
    nextRawProps: Object,
    rootContainerElement: Board,
  ): void /*null | Array<mixed>*/ {
    /*
    return nextRawProps;
    return diff(lastRawProps, nextRawProps, {
      pins: true,
      values: true,
      children: true
    });
    */
  },

  updateProperties(
    element: Instance,
    updatePayload: Array<mixed>,
    type: string,
    oldProps: Props,
    newProps: Props,
    internalInstanceHandle: Object,
  ) {
    // Deprecated path for when a `container` is hit which was a hack in stack
    // for being unable to return an array from render.
    if (newProps.tag === 'container') {
      return;
    }

    const rootContainerElement = element[IO_KEY];
    assertValidProps(rootContainerElement, newProps);
    Object.assign(element, newProps);
    setPayloadForPin(rootContainerElement, element);
    // console.log('updateProperties', element);
  },
};

export default ReactHardwareFiberComponent;
