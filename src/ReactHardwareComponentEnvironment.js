import ReactHardwareDOMIDOperations from './ReactHardwareDOMIDOperations';
import ReactHardwareReconcileTransaction from './ReactHardwareReconcileTransaction';

var ReactHardwareComponentEnvironment = {

  processChildrenUpdates: ReactHardwareDOMIDOperations.dangerouslyProcessChildrenUpdates,

  replaceNodeWithMarkupByID: ReactHardwareDOMIDOperations.dangerouslyReplaceNodeWithMarkupByID,

  /**
   * @private
   */
  unmountIDFromEnvironment: function(/*rootNodeID*/) {

  },

  /**
   * @param {DOMElement} Element to clear.
   */
  clearNode: function(/*containerView*/) {

  },

  ReactReconcileTransaction: ReactHardwareReconcileTransaction,
};

module.exports = ReactHardwareComponentEnvironment;

