/** @flow */

import * as React from 'react';
import type {Board} from 'firmata';

import createReconciler from 'react-reconciler';
import ReactHardwareFiberComponent from './ReactHardwareFiberComponent';
import HardwareInstanceManager from '../firmata/HardwareInstanceManager';
import {setPayloadForPin} from '../firmata/HardwareManager';
import {
  now as ReactHardwareFrameSchedulingNow,
  cancelDeferredCallback as ReactHardwareFrameSchedulingCancelDeferredCallback,
  scheduleDeferredCallback as ReactHardwareFrameSchedulingScheduleDeferredCallback,
  shouldYield as ReactHardwareFrameSchedulingShouldYield,
} from './ReactHardwareFrameScheduling';
import * as NoPersistence from './HostConfigWithNoPersistence';
import * as NoHydration from './HostConfigWithNoHydration';

const {
  createElement,
  setInitialProperties,
  diffProperties,
  updateProperties,
} = ReactHardwareFiberComponent;

// why four? no reason.
const TIME_REMAINING = 4;
const precacheFiberNode = (internalInstanceHandle, instance) => null; // TODO: ReactHardwareComponentTree
const emptyObject = {};

type HostContext = any;
type Container = Board;
type Props = Object;
type Instance = any; // TODO
type TextInstance = any; // TODO

const HardwareRenderer = createReconciler({
  ...NoPersistence,
  ...NoHydration,
  appendInitialChild(
    parentInstance: Instance | Container,
    child: Instance | TextInstance,
  ) {
    // Deprecated path for when a `container` is hit which was a hack in stack
    // for being unable to return an array from render.
    if (parentInstance === child) {
      return;
    }

    setPayloadForPin(parentInstance, child);
    // parentInstance.appendChild(child);
  },
  createInstance(
    type: string,
    props: Props,
    rootContainerInstance: Container,
    hostContext: string | null,
    internalInstanceHandle: Object,
  ): Instance {
    const instance: Instance = createElement(
      type,
      props,
      rootContainerInstance,
      hostContext,
    );
    precacheFiberNode(internalInstanceHandle, instance);
    return instance;
  },

  createTextInstance(
    text: string,
    internalInstanceHandle: Object,
  ): TextInstance {
    return text;
  },

  finalizeInitialChildren(
    parentInstance: Instance,
    type: string,
    props: Props,
    rootContainerInstance: Container,
    hostContext: HostContext,
  ) {
    setInitialProperties(parentInstance, type, props, hostContext);
  },

  getRootHostContext(rootContainerInstance: Board): Board {
    return HardwareInstanceManager.get('/dev/tty.usbmodem1461101');
    return rootContainerInstance;
  },

  getChildHostContext(
    parentHostContext: HostContext,
    type: string,
    rootContainerInstance: Container,
  ): HostContext {
    // maybe useful for portals?
    return parentHostContext;
  },

  getPublicInstance(instance: Instance): * {
    return instance;
  },

  prepareForCommit(containerInfo: Container): void {
    // Noop
  },

  prepareForCommit(): void {
    // Noop
  },

  prepareUpdate(
    instance: Instance,
    type: string,
    oldProps: Props,
    newProps: Props,
    rootContainerInstance: Container,
    hostContext: HostContext,
  ): null | Object {
    return null;
    // diffing properties here allows the reconciler to reuse work
    return diffProperties(
      instance,
      type,
      oldProps,
      newProps,
      rootContainerInstance,
    );
    // return emptyObject;
  },

  resetAfterCommit(): void {
    // Noop
  },

  now: ReactHardwareFrameSchedulingNow,
  isPrimaryRenderer: true,
  scheduleDeferredCallback: ReactHardwareFrameSchedulingScheduleDeferredCallback,
  cancelDeferredCallback: ReactHardwareFrameSchedulingCancelDeferredCallback,
  shouldYield: ReactHardwareFrameSchedulingShouldYield,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  schedulePassiveEffects: ReactHardwareFrameSchedulingScheduleDeferredCallback,
  cancelPassiveEffects: ReactHardwareFrameSchedulingCancelDeferredCallback,

  shouldDeprioritizeSubtree(type: string, props: Props): boolean {
    return false;
  },

  shouldSetTextContent(props: Props): boolean {
    return false;
  },

  // MUTATION

  supportsMutation: true,
  appendChild(
    parentInstance: Instance | Container,
    child: Instance | TextInstance,
  ) {
    // Deprecated path for when a `container` is hit which was a hack in stack
    // for being unable to return an array from render.
    if (parentInstance === child) {
      return;
    }

    setPayloadForPin(parentInstance, child);
    // parentInstance.appendChild(child);
  },

  appendChildToContainer(
    parentInstance: Instance,
    child: Instance | TextInstance,
  ): void {
    setPayloadForPin(parentInstance, child);
    // parentInstance.appendChild(child);
  },

  commitTextUpdate(
    textInstance: TextInstance,
    oldText: string,
    newText: string,
  ) {
    // Noop / TODO
  },

  commitMount(
    instance: Instance,
    type: string,
    newProps: Props,
    internalInstanceHandle: Object,
  ): void {
    console.log('commitMoutnt', type, newProps);
    // Noop / TODO
  },

  commitUpdate(
    instance: Instance,
    updatePayload: Object,
    type: string,
    oldProps: Props,
    newProps: Props,
    internalInstanceHandle: Object,
  ): void {
    // Update the props handle so that we know which props are the ones with
    // with current event handlers.
    // Apply the diff to the host node.
    updateProperties(
      instance,
      updatePayload,
      type,
      oldProps,
      newProps,
      internalInstanceHandle,
    );
  },

  insertBefore(
    parentInstance: Instance | Container,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ) {
    // This should probably never be called in Hardware.
    console.warn('TODO: ReactHardwareRenderer.insertBefore');
    // parentInstance.insertBefore(child, beforeChild);
  },

  insertInContainerBefore(
    parentInstance: Instance | Container,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ) {
    // This should probably never be called in Hardware.
    console.warn('TODO: ReactHardwareRenderer.insertInContainerBefore');
    // parentInstance.insertBefore(child, beforeChild);
  },

  removeChild(
    parentInstance: Instance | Container,
    child: Instance | TextInstance,
  ): void {
    console.warn('TODO: ReactHardwareRenderer.removeChild');
    // parentInstance.removeChild(child);
  },

  removeChildFromContainer(
    parentInstance: Container,
    child: Instance | TextInstance,
  ): void {
    console.warn('TODO: ReactHardwareRenderer.removeChildFromContainer');
    // parentInstance.removeChild(child);
  },

  resetTextContent(element: Instance): void {
    // NOOP
  },

  hideInstance(element: Instance): void {
    console.warn('TODO: ReactHardwareRenderer.hideInstance');
  },

  hideTextInstance(element: Instance): void {
    console.warn('TODO: ReactHardwareRenderer.hideTextInstance');
  },

  unhideInstance(element: Instance): void {
    console.warn('TODO: ReactHardwareRenderer.unhideInstance');
  },

  unhideTextInstance(element: Instance): void {
    console.warn('TODO: ReactHardwareRenderer.unhideTextInstance');
  },

  /*
  injectIntoDevTools({
    findFiberByHostInstance: () => null,// ReactHardwareComponentTree.getClosestInstanceFromNode,
    // findHostInstanceByFiber: HardwareRenderer.findHostInstance,
  }),
  */
});

function renderSubtreeIntoContainer(
  parentComponent: ?React.Component<any, any>,
  element: React.Element<any>,
  container: string,
  callback: ?Function,
) {
  const root = HardwareInstanceManager.get(container);
  if (root) {
    HardwareRenderer.updateContainer(element, root, parentComponent, callback);
  } else {
    HardwareInstanceManager.connect(container, (error, root) => {
      if (error) {
        console.log(error);
      } else {
        const root = HardwareRenderer.createContainer(container);
        HardwareRenderer.updateContainer(
          element,
          root,
          parentComponent,
          callback,
        );
        // HardwareRenderer.mountContainer(element, root, parentComponent, callback);
      }
    });
  }
}

const ReactHardware = {
  render(element: ReactElement<any>, container: string, callback: ?Function) {
    return renderSubtreeIntoContainer(null, element, container, callback);
  },

  unmountComponentAtNode(container: string) {
    const root = HardwareInstanceManager.get(container);
    if (root) {
      HardwareRenderer.unmountContainer(root);
    }
  },
  // TODO: unstable_createPortal(children : ReactNodeList, container : string, key : string | null) {}
};

export default ReactHardware;
