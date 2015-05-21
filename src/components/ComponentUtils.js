import {customDirectEventTypes} from '../HardwareManager';
import ReactHardwareEventEmitter from '../ReactHardwareEventEmitter';
import findNodeHandle from '../findNodeHandle';

/**
 * used to create EVENT_TYPE hash for each component
 * to look up variables based on a constant.
 *
 * var EVENT_TYPE = collect(
 *   HardwareManager.customDirectEventTypes,
 *   CHANGE_EVENT, CLOSE_EVENT, OPEN_EVENT
 * );
 *
 * => { topChange: {registrationName: 'onChange'},
 *      topClose: {registrationName: 'onClose'},
 *      topOpen: {registrationName: 'onOpen'},
 *    }
 */
export var collect = (obj, ...things) =>
  things.reduce((memo, thing) => ((memo[thing] = obj[thing]), memo), {});


export function emitEvent(componentInstance, nodeHandle, eventName, value) {
  ReactHardwareEventEmitter.receiveEvent(
    nodeHandle,
    eventName,
    {
      value: value,
      target: componentInstance,
      type: customDirectEventTypes[eventName].registrationName,
    }
  );
}

