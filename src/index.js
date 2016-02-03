/* @flow */

import ReactCurrentOwner from 'react/lib/ReactCurrentOwner';
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

/* globals __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = ({
    CurrentOwner: ReactCurrentOwner,
    // InstanceHandles: ReactInstanceHandles,
    Mount: ReactHardwareMount,
    Reconciler: require('react/lib/ReactReconciler'),
  });
}

