/** @flow */
import {Board} from 'firmata';
import invariant from 'fbjs/lib/invariant';
import {analogToDigital} from './HardwarePinTranslations';

/**
 * map firmata’s Pin MODEs to what
 * type of firmata communication method
 * should be called.
 * @examples
 *   // should call digital(Read|Write)
 *   <pin mode="INPUT" />
 *
 *   // should call analog(Read|Write)
 *   <pin mode="PWM" />
 *
 *   // should call i2cConfig, is2(Read|Write)
 *   <pin mode="i2c" />
 */
const FIRMATA_COMMUNICATION_METHOD = {
  '0': 'digital',  // input
  '1': 'digital',  // output
  '2': 'analog',   // analog
  '3': 'analog',   // pwm
  '4': 'servo',    // servo
  '5': 'UNKNOWN',  // shift
  '6': 'i2c',      // i2c
  '7': 'UNKNOWN',  // onewire
  '8': 'UNKNOWN',  // stepper
  '16': 'UNKNOWN', // unknown
  '127': 'IGNORE', // ignore
};

export type Connection = {
  rootID: string,
  status: 'CONNECTING' | 'CONNECTED',
  component: any, // ReactComponent
  board: typeof Board,
  readers: {[pin:string]: (...args:any) => any},
};

const deferredReader =
  (connection, pin) =>
    (value) => connection.readers[pin].call(value);

const setReader = (
  connection : Connection,
  communicationType : string,
  payload : Object
) => {
  if (!connection.readers[payload.pin]) {
    const reader = deferredReader(connection, payload.pin);
    connection.readers[payload.pin] = {reader, call: null};

    // map A0-A5 to the appropriate analog index for node-firmata
    const toNodeFirmataMapping = typeof payload.pin === 'string' ? parseInt(payload.pin.slice(1), 10) : payload.pin;
    connection.board[`${communicationType}Read`](toNodeFirmataMapping, reader);
    connection.readers[payload.pin].call = payload.onRead;
  }

  connection.readers[payload.pin].call = payload.onRead;
};

export const connectionsByContainer:{[key:string]: Connection} = {};

// matches return value of the input value
type FindConnectionForRootId = (rootID:string) => ?Connection;
const findConnectionForRootId:FindConnectionForRootId = (rootID) => {
  for (const connection in connectionsByContainer) {
    if (connectionsByContainer[connection].rootID !== rootID) {
      continue;
    }

    return connectionsByContainer[connection];
  }
};

/**
 * Validates a desired payload to a Pin according the boards reported Pin
 * configuration.
 */
export const validatePayloadForPin = (
  maybeConnection : string | Connection | typeof Board,
  payload : Object
) => {
  if (payload == null) {
    return;
  }

  const connection =  typeof maybeConnection === 'string'
    ? findConnectionForRootId(maybeConnection)
    : maybeConnection;

  invariant(
    !!connection,
    'Attempting to update connection string "%s" that no longer exists',
    connection
  );

  const {board} = connection;
  const {pins, MODES} = board;

  const mode = MODES[payload.mode];

  // map from mode identifier back to a friendly string
  const idToModeName = {};
  for (const mode of Object.keys(MODES)) {
    idToModeName[MODES[mode]] = mode;
  }

  const normalizedPin = analogToDigital(payload.pin);
  const {supportedModes, analogChannel} = pins[normalizedPin];
  invariant(
    supportedModes.indexOf(mode) !== -1 ||
    (analogChannel === 127 && payload.mode === 'DIGITAL'),
    'Unsupported mode "%s" for pin "%s".\nSupported modes are: "%s"',
    payload.mode, payload.pin, supportedModes.map(m => idToModeName[m]).join('", "') || 'DIGITAL'
  );
};

/**
 * Sets a pin's values to the desired payload.
 */
export const setPayloadForPin = (
  maybeConnection : string | Connection | typeof Board,
  payload : ?Object
) => {
  if (payload == null) {
    return;
  }

  const connection = typeof maybeConnection === 'string' ?
    findConnectionForRootId(maybeConnection) :
    maybeConnection;

  if (!connection) {
    return;
  }

  // backwards compatible with Stack
  const board = connection.board || connection;
  const {MODES} = board;

  // console.log(`set pinMode of "%s" to "%s"`, payload.pin, payload.mode);
  const normalizedPin = analogToDigital(payload.pin);
  board.pinMode(normalizedPin, MODES[payload.mode]);
  const communicationType = FIRMATA_COMMUNICATION_METHOD[MODES[payload.mode]];
  if (typeof payload.value !== 'undefined') {
    // console.log(`${communicationType}Write to "%s" with "%s"`, payload.pin, payload.value);
    board[`${communicationType}Write`](payload.pin, +payload.value);
  }

  if (payload.onRead) {
    setReader(connection, communicationType, payload);
  }
};

/**
 * NOTE: This is a leaky abstraction. It returns the direct Board IO instance.
 */
export const getNativeNode = (
  component : React$Component&{_rootNodeID:string}
) : Board | null => {
  const connection = findConnectionForRootId(component._rootNodeID);

  if (connection) {
    return connection.board;
  } else {
    return null;
  }
};

