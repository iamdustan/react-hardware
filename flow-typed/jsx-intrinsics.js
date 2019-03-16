/* @flow */

// $JSXIntrinsics is special and magic.
declare type $JSXIntrinsics = {
  // This declares the types for `pin`
  pin: {
    instance: any,
    props: {
      mode:
        | 'INPUT'
        | 'OUTPUT'
        | 'ANALOG'
        | 'PWM'
        | 'SERVO'
        | 'SHIFT'
        | 'I2C'
        | 'ONEWIRE'
        | 'STEPPER'
        | 'IGNORE'
        | 'UNKNOWN',
      pin: number | string,
      value?: number,
      onRead?: (...arg: any) => any,
    },
  },
  // This declares the types for `pin`
  container: {
    instance: any,
    props: {
      children: React$Node,
    },
  },
};
