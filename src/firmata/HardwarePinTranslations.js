/**
 * @flow
 */

const UNO_ANALOG_TO_DIGITAL = {
  A0: 14,
  A1: 15,
  A2: 16,
  A3: 17,
  A4: 18,
  A5: 19,
};

export const analogToDigital = (pin: string | number): number =>
  UNO_ANALOG_TO_DIGITAL[pin] || +pin;
