/**
 * Useful function for normalizing port across all examples either by
 * an environment variable or local, hard-coded value.
 */

export const getPort = () =>
  process.env.REACT_HARDWARE_EXAMPLE_PORT || process.env.NODE_ENV === 'test'
    ? '/dev/cu.usbmodem1451'
    : null;
