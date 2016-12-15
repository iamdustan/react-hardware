/** @flow */

import type {Fiber} from 'react-dom/lib/ReactFiber';
import type {FirmataBoard} from './types';

import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler';
import ReactHardwareFiberComponent from './ReactHardwareFiberComponent';
import HardwareInstanceManager from './firmata/HardwareInstanceManager';

const {
  createElement,
  setInitialProperties,
  updateProperties,
} = ReactHardwareFiberComponent;

const precacheFiberNode = (internalInstanceHandle, instance) => null; // TODO: ReactHardwareComponentTree

type Container = FirmataBoard;
type Props = Object;
type Instance = any; // TODO
type TextInstance = any; // TODO

const HardwareRenderer = ReactFiberReconciler({
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
    console.log('created instance', instance);
    precacheFiberNode(internalInstanceHandle, instance);
    return instance;
  },

  appendInitialChild(
    parentInstance: Instance,
    child: Instance | TextInstance
  ) {
    parentInstance.appendChild(child);
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
    parentInstance.appendChild(child);
  },

  insertBefore(
    parentInstance : Instance | Container,
    child : Instance | TextInstance,
    beforeChild : Instance |  TextInstance
  ) {
    parentInstance.insertBefore(child, beforeChild);
  },

  removeChild(parentInstance : Instance | Container, child : Instance | TextInstance) : void {
    parentInstance.removeChild(child);
  },

  scheduleAnimationCallback: process.nextTick,

  scheduleDeferredCallback: (fn) => setTimeout(fn, 16),

  useSyncScheduling: true,
});

function renderSubtreeIntoContainer(
  parentComponent : ?ReactComponent<any, any, any>,
  element : ReactElement<any>,
  container : string,
  callback: ?Function
) {
  const root = HardwareInstanceManager.get(container);
  if (!root) {
    HardwareInstanceManager.connect(container, (error, root) => {
      HardwareRenderer.mountContainer(element, root, parentComponent, callback);
    });
  } else {
    HardwareRenderer.updateContainer(element, root, parentComponent, callback);
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

