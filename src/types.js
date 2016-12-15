/** @flow */

export type HardwareEvent = {
  value: number;
  type: string;
};

declare class FirmataBoard extends EventEmitter {
  constructor (port: string, options: Object, callback: Function): FirmataBoard
}


