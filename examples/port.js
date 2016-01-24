/**
 * Useful function for normalizing port across all examples either by
 * an environment variable or local, hard-coded value.
 */

export const getPort = () => {
  return (
    process.env.REACT_HARDWARE_EXAMPLE_PORT ||
    '/dev/cu.usbmodem1451'
  );
};

