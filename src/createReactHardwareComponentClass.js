// import ReactElement from 'react/lib/ReactElement';
import ReactHardwareNativeComponent from './ReactHardwareNativeComponent';

// See also ReactHardwareNativeComponent
type ReactHardwareNativeComponentViewConfig = {
  validAttributes: Object;
  uiViewClassName: string;
}

/**
 * @param {string} config
 * @private
 */
var createReactHardwareNativeComponentClass = function(
  viewConfig: ReactHardwareNativeComponentViewConfig
): Function { // returning Function is lossy :/
  var Constructor = function(element) {
    this._currentElement = element;

    this._rootNodeID = null;
    this._renderedChildren = null;
    // for events to pull the value off of the target
    this.value = null;
  };
  Constructor.displayName = viewConfig.uiViewClassName;
  Constructor.prototype = new ReactHardwareNativeComponent(viewConfig);

  return Constructor;
};

export default createReactHardwareNativeComponentClass;

