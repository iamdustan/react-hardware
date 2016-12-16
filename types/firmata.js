/* @flow */
/* eslint-disable */

type Port = string;
type Options = {
  reportVersionTimeout?: number,
  samplingInterval?: number,
  serialport?: {
    baudRate?: number,
    bufferSize?: number,
  },
};
type Pin = number;
type Microsecond = number;
type Millisecond = number;
type Mode =
  | string
  | 'TODO';

type Byte = any; // FIXME
// TOOD: fix these
type Unknown = any;

declare module 'firmata' {
  declare class Board extends events$EventEmitter {
    constructor(port: Port, options: Options, callback: Function): Board;
    constructor(port: Port, callback: Function): Board;

    // TODO
    MODES: Object;

    reportVersion(callback: Function): void;
    queryFirmware(callback: Function): void;
    analogRead(pin: Pin, callback: Function): void;
    analogWrite(pin: Pin, value: number): void;
    pwmWrite(pin: Pin, value: number): void;
    servoConfig(pin: Pin, min: number, max: number): void;
    servoWrite(pin: Pin, value: number): void;
    pinMode(pin: Pin, mode: Mode): void;
    digitalWrite(pin: Pin, value: number): void;
    digitalRead(pin: Pin, callback: Function): void;
    queryCapabilities(callback: Function): void;
    queryAnalogMapping(callback: Function): void;
    queryPinState(pin: Pin, callback: Function): void;
    sendString(str: string): void;
    sendI2CConfig(delay: Microsecond): void;

    i2cConfig(options: Microsecond): void;
    i2cConfig(options: {delay: Microsecond}): void;

    sendI2CWriteRequest(slaveAddress: number, bytes: Byte): void;

    i2cWrite(address: number, registerOrData: Array<*>): void;
    i2cWrite(address: number, command: number, data: Array<*>): void;

    i2cWriteReg(address: number, register: number, byte: Byte): void;
    i2cWriteReg(address: number, register: number, byte: Byte): void;

    sendI2CReadRequest(address: number, numBytes: number, callback: Function): void;

    i2cRead(address: number, register: number, bytesToRead: number, callback: Function): void;
    i2cRead(address: number, bytesToRead: number, callback: Function): void;

    i2cStop(address: number): void;
    i2cStop(options: {|bus: number, address: number|}): void;

    i2cReadOnce(address: number, register: number, bytesToRead: number, callback: Function): void;
    i2cReadOnce(address: number, bytesToRead: number, callback: Function): void;

    sendOneWireConfig(pin: Pin, enableParasiticPower: boolean): void;
    sendOneWireSearch(pin: Pin, callback: Function): void;
    sendOneWireAlarmsSearch(pin: Pin, callback: Function): void;
    sendOneWireAlarmsSearch(pin: Pin, callback: Function): void;

    _sendOneWireSearch(type: Unknown, event: Unknown, pin: Pin, callback: Function): void;
    sendOneWireRead(pin: Pin, device: Unknown, numBytesToRead: number, callback: Function): void;
    sendOneWireReset(pin: Pin): void;
    sendOneWireWrite(pin: Pin, device: Unknown, data: Unknown): void;
    sendOneWireDelay(pin: Pin, delay: Microsecond): void;
    sendOneWireWriteAndRead(pin: Pin, device: Unknown, data: Unknown, numBytesToRead: number, callback: Function): void;

    // see http://firmata.org/wiki/Proposals#OneWire_Proposal
    _sendOneWireRequest(
      pin: Pin,
      subcommand: Unknown,
      device: ?Unknown,
      numBytesToRead: ?number,
      correlationId: ?number,
      delay: ?Microsecond,
      dataToWrite: ?Unknown,
      event: ?Unknown,
      callback: ?Function
    ): void;

    setSamplingInterval(interval: Millisecond): void;
    getSamplingInterval(): Millisecond;
    reportAnalogPin(pin: Pin, value: 0 | 1): void;
    reportDigitalPin(pin: Pin, value: 0 | 1): void;
    pingRead(
      opts: {|
        pin: Pin,
        value: number,
        pulseOut?: number,
        timeout?: number,
      |},
      callback: Function
    ): void;

    // TODO: refine this so motor3Pin and motor4Pin are only required if type == this.STEPPER.TYPE.FOUR_WIRE
    stepperConfig(
      deviceNum: number,
      type: number,
      stepsPerRev: number,
      dirOrMotor1Pin: number,
      stepOrMotor2Pin: number,
      motor3Pin: number,
      motor4Pin: number
    ): void;

    stepperStep(
      deviceNum: number,
      direction: number, // TODO : enum of this.step.STEPPER.DIRECTION
      steps: number,
      speed: number,
      accel: number,
      decel: number,
      callback: Function
    ): void;
    stepperStep(
      deviceNum: number,
      direction: number, // TODO : enum of this.step.STEPPER.DIRECTION
      steps: number,
      speed: number,
      callback: Function
    ): void;


    serialConfig(
      options: {|
        portId: number, // SERIAL1, HW_SERIAL2, HW_SERIAL3, SW_SERIAL0, SW_SERIAL1, SW_SERIAL2, SW_SERIAL3
        baud: number,
        rxPin?: number,
        txPin?: number,
      |}
    ): void;

    serialWrite(portId: number, inBytes: Array<*>): void;
    serialRead(portId: number, maxBytesToRead: number, callback: Function): void;
    serialStop(portId: number): void;
    serialClose(portId: number): void;
    serialFlush(portId: number): void;
    serialListen(portId: number): void;


    sysexResponse(commandByte: number, handler: Function): void;
    sysexCommand(message: Array<*>): void;

    reset(): void;


    static isAcceptablePort(port: string): boolean;
    static requestPort(
      callback : (
        error: ?Error,
        port: {
          comName: Port
        }
      ) => void
    ): void;
    // TODO: constrain these
    static SYSEX_RESPONSE: {[event: number]: Function};
    static MIDI_RESPONSE: {[event: number]: Function};

    // Expose encode/decode for custom sysex messages
    static encode(data: any): any;
    static decode(data: any): any;
  }
}

