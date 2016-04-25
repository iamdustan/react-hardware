/* @flow */

import ReactHardwareMount from './ReactHardwareMount';
import * as ReactHardwareComponents from './components';

export * from './components';
export const render = ReactHardwareMount.render;
export const unmountComponentAtNode = ReactHardwareMount.unmountComponentAtNode;

const ReactHardware = Object.assign(
  {},
  {
    render: ReactHardwareMount.render,
    unmountComponentAtNode: ReactHardwareMount.unmountComponentAtNode,
  },
  ReactHardwareComponents
);

export default ReactHardware;
