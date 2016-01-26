var mock = require('mock-firmata');
var Firmata = require('firmata');
mock.Firmata.requestPort = function() {};

const origMockFirmata = mock.Firmata;
mock.Firmata = function(opts, callback) {
  const result = new origMockFirmata(opts);
  if (callback) {
    setTimeout(() => {
      callback.call(result);
    });
  }
  return result;
};

Object.assign(mock.Firmata, origMockFirmata);

// use the real implementation for this
mock.Firmata.isAcceptablePort = Firmata.isAcceptablePort;

module.exports = mock;

