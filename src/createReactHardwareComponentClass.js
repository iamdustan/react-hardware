/* @flow */

import type {ReactHardwareComponentViewConfig} from './ReactHardwareComponent';

import ReactHardwareComponent from './ReactHardwareComponent';

export default function createReactHardwareComponentClass(
  viewConfig: ReactHardwareComponentViewConfig
): ReactClass<any> {
  const Constructor = function(element) {
    this.construct(element);
  };
  Constructor.displayName = viewConfig.uiViewClassName;
  Constructor.viewConfig = viewConfig;
  Constructor.propTypes = viewConfig.propTypes;
  // $FlowFixMe: need to pass in the elmenet here maybe?
  Constructor.prototype = new ReactHardwareComponent({});
  Constructor.prototype.constructor = ReactHardwareComponent;

  return ((Constructor: any): ReactClass);
}

