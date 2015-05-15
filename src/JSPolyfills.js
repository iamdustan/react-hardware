var lastTime = 0;

var FRAME = 16;
var FRAME = 75;

global.requestAnimationFrame = function(callback, element) {
  var currTime = new Date().getTime();
  var timeToCall = Math.max(0, FRAME - (currTime - lastTime));
  var id = setTimeout(() => callback(currTime + timeToCall), timeToCall);
  lastTime = currTime + timeToCall;
  return id;
};

global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

