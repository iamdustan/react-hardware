/* @flow */

import ReactHardwareMount from './ReactHardwareMount';
import ReactHardwareComponents from './components';

const ReactHardware = {
  render: ReactHardwareMount.render,
  unmountComponentAtNode: ReactHardwareMount.unmountComponentAtNode,
};

Object.assign(ReactHardware, ReactHardwareComponents);

export default ReactHardware;

