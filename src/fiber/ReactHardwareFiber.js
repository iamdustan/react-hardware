/** @flow */

import type {Board} from 'firmata';
import type {Fiber} from 'react-dom/lib/ReactFiber';

import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler';
import ReactHardwareFiberComponent from './ReactHardwareFiberComponent';
import HardwareInstanceManager from '../firmata/HardwareInstanceManager';
import {setPayloadForPin} from '../firmata/HardwareManager';

const {
  createElement,
  setInitialProperties,
  updateProperties,
} = ReactHardwareFiberComponent;

// why four? no reason.
const TIME_REMAINING = 4;
const precacheFiberNode = (internalInstanceHandle, instance) => null; // TODO: ReactHardwareComponentTree

type Container = Board;
type Props = Object;
type Instance = any; // TODO
type TextInstance = any; // TODO

const HardwareRenderer = ReactFiberReconciler({
  getRootHostContext(rootContainerInstance : Board) : Board {
    return rootContainerInstance;
  },

  getChildHostContext(parentHostContext : string | null, type : string) : void {
    // Noop
  },


  prepareForCommit() : void {
    // Noop
  },

  resetAfterCommit() : void {
    // Noop
  },

  createInstance(
    type : string,
    props : Props,
    rootContainerInstance : Container,
    hostContext : string | null,
    internalInstanceHandle : Object,
  ): Instance {
    const instance : Instance = createElement(type, props, rootContainerInstance, hostContext);
    precacheFiberNode(internalInstanceHandle, instance);
    return instance;
  },

  appendInitialChild(
    parentInstance: Instance,
    child: Instance | TextInstance
  ) {
    setPayloadForPin(parentInstance, child);
    // parentInstance.appendChild(child);
  },

  finalizeInitialChildren(
    element : Instance,
    type : string,
    props : Props,
    rootContainerInstance : Container
  ) {
    setInitialProperties(element, type, props, rootContainerInstance);
  },

  prepareUpdate(domElement : Instance, oldProps : Props, newProps : Props) {
    return true;
  },

  commitUpdate(
    instance : Instance,
    type : string,
    oldProps : Props,
    newProps : Props,
    rootContainerInstance : Container,
    internalInstanceHandle : Object
  ) : void {
    precacheFiberNode(internalInstanceHandle, instance);
    updateProperties(instance, type, oldProps, newProps, rootContainerInstance);
  },

  shouldSetTextContent(props: Props) : boolean {
    return false;
  },

  resetTextContent(element: Instance) : void {
    // NOOP
  },

  createTextInstance(text : string, internalInstanceHandle : Object) : TextInstance {
    return text;
  },

  commitTextUpdate(
    textInstance : TextInstance,
    oldText : string,
    newText : string
  ) {
    // Noop
  },

  appendChild(
    parentInstance: Instance | Container,
    child: Instance | TextInstance
  ) {
    // Deprecated path for when a `container` is hit which was a hack in stack
    // for being unable to return an array from render.
    if (parentInstance === child) {
      return;
    }

    setPayloadForPin(parentInstance, child);
    // parentInstance.appendChild(child);
  },

  insertBefore(
    parentInstance : Instance | Container,
    child : Instance | TextInstance,
    beforeChild : Instance |  TextInstance
  ) {
    // This should probably never be called in Hardware.
    console.warn('TODO: ReactHardwareRenderer.insertBefore');
    // parentInstance.insertBefore(child, beforeChild);
  },

  removeChild(parentInstance : Instance | Container, child : Instance | TextInstance) : void {
    console.warn('TODO: ReactHardwareRenderer.removeChild');
    // parentInstance.removeChild(child);
  },

  scheduleAnimationCallback: process.nextTick,

  scheduleDeferredCallback: (fn) => setTimeout(fn, TIME_REMAINING, {timeRemaining() { return TIME_REMAINING; }}),

  useSyncScheduling: false,
});

function renderSubtreeIntoContainer(
  parentComponent : ?ReactComponent<any, any, any>,
  element : ReactElement<any>,
  container : string,
  callback: ?Function
) {
  const root = HardwareInstanceManager.get(container);
  if (root) {
    HardwareRenderer.updateContainer(element, root, parentComponent, callback);
  } else {
    HardwareInstanceManager.connect(container, (error, root) => {
      if (error) {
        console.log(error);
      } else {
        console.log('mountContainer');
        HardwareRenderer.mountContainer(element, root, parentComponent, callback);
      }
    });
  }
}

const ReactHardware = {
  render(
    element : ReactElement<any>,
    container : string,
    callback : ?Function
  ) {
    return renderSubtreeIntoContainer(null, element, container, callback);
  },

  unmountComponentAtNode(container : string) {
    const root = HardwareInstanceManager.get(container);
    if (root) {
      HardwareRenderer.unmountContainer(root);
    }
  },

  // TODO: unstable_createPortal(children : ReactNodeList, container : string, key : string | null) {}
};

export default ReactHardware;

