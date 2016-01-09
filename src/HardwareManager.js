/** @flow */
import {Board} from 'firmata';
import invariant from 'fbjs/lib/invariant';

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
  0: 'digital',  // input
  1: 'digital',  // output
  2: 'analog',   // analog
  3: 'analog',   // pwm
  4: 'servo',    // servo
  5: 'UNKNOWN',  // shift
  6: 'i2c',      // i2c
  7: 'UNKNOWN',  // onewire
  8: 'UNKNOWN',  // stepper
  16: 'UNKNOWN', // unknown
  127: 'IGNORE', // ignore
};

export type Connection = {
  rootID: string;
  status: 'CONNECTING' | 'CONNECTED';
  component: ?ReactElement;
  board: typeof Board;
};

export const connectionsByContainer:{[key:string]: Connection} = {};

const findConnectionForRootId = (rootID:string) => {
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
  connection:string|Connection,
  payload:Object
) => {
  if (payload == null) {
    return;
  }

  if (typeof connection === 'string') {
    connection = findConnectionForRootId(connection);
  }

  const {board} = connection;
  const {pins, MODES} = board;

  const mode = MODES[payload.mode];

  // map from mode identifier back to a friendly string
  const idToModeName = {};
  for (const mode of Object.keys(MODES)) {
    idToModeName[MODES[mode]] = mode;
  }

  const {supportedModes, analogChannel} = pins[payload.pin];
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
  connection:string|Connection,
  payload:Object
) => {
  if (payload == null) {
    return;
  }

  if (typeof connection === 'string') {
    connection = findConnectionForRootId(connection);
  }

  const {board} = connection;
  const {MODES} = board;

  // console.log(`set pinMode of "%s" to "%s"`, payload.pin, payload.mode);
  board.pinMode(payload.pin, MODES[payload.mode]);
  const communicationType = FIRMATA_COMMUNICATION_METHOD[MODES[payload.mode]];
  if (typeof payload.value !== 'undefined') {
    // console.log(`${communicationType}Write to "%s" with "%s"`, payload.pin, payload.value);
    board[`${communicationType}Write`](payload.pin, +payload.value);
  }
};

