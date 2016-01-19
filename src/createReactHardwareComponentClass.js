/* @flow */

import type {ReactHardwareComponentViewConfig} from './ReactHardwareComponent';

import ReactHardwareComponent from './ReactHardwareComponent';

export default function createReactHardwareComponentClass(
  viewConfig: ReactHardwareComponentViewConfig
): ReactClass<any, any, any> {
  const Constructor = function(element) {
    this._currentElement = element;

    this._rootNodeID = null;
    this._renderedChildren = null;
  };
  Constructor.displayName = viewConfig.uiViewClassName;
  Constructor.viewConfig = viewConfig;
  Constructor.propTypes = viewConfig.propTypes;
  Constructor.prototype = new ReactHardwareComponent(viewConfig);
  Constructor.prototype.constructor = Constructor;

  return ((Constructor: any): ReactClass);
}

