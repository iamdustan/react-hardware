/* @flow */
/* eslint-disable */

// JSXHelper is a type alias to make this example more concise.
// There's nothing special or magic here.
// JSXHelper<{name: string}> is a React component
// with the single string property "name", which has a default
type JSXHelper<T> = Class<React$Component<{}, T, any>>;

// $JSXIntrinsics is special and magic.
// This declares the types for `pin`
declare type $JSXIntrinsics = {
  pin: JSXHelper<{
    mode: 'INPUT'|'OUTPUT'|'ANALOG'|'PWM'| 'SERVO'|'SHIFT'|'I2C'|'ONEWIRE'|'STEPPER'|'IGNORE'|'UNKNOWN';
    pin: number|string;
    value?: number;
    onRead?: (...arg:any) => any;
  }>;

  container: JSXHelper<{}>;
};

