/**
 *
 **/

import ReactHardwareMount from './stack/ReactHardwareMount';
import * as ReactHardwareComponents from './components';

const ReactHardware = Object.assign(
  {},
  {
    render: ReactHardwareMount.render,
    unmountComponentAtNode: ReactHardwareMount.unmountComponentAtNode,
  },
  ReactHardwareComponents
);

export * from './components';
export const render = ReactHardwareMount.render;
export const unmountComponentAtNode = ReactHardwareMount.unmountComponentAtNode;
export default ReactHardware;

