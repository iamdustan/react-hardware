var patchExecutionEnvironment = () => {
  var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');
  ExecutionEnvironment.canUseDOM = false;
  ExecutionEnvironment.canUseWorkers = typeof Worker !== 'undefined';
  ExecutionEnvironment.canUseEventListeners = false;
  ExecutionEnvironment.canUseViewport = false;
  ExecutionEnvironment.isInWorker = true;
};

export var patchReact = () => (
  patchExecutionEnvironment()
);
