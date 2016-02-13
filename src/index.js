/* @flow */

import ReactHardwareMount from './ReactHardwareMount';
import * as ReactHardwareComponents from './components';

const ReactHardware = Object.assign(
  {},
  {
    render: ReactHardwareMount.render,
    unmountComponentAtNode: ReactHardwareMount.unmountComponentAtNode,
  },
  ReactHardwareComponents
);

export default ReactHardware;

