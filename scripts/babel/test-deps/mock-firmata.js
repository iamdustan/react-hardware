var mock = require('mock-firmata');
var Firmata = require('firmata');
mock.Firmata.requestPort = function() {};

// use the real implementation for this
mock.Firmata.isAcceptablePort = Firmata.isAcceptablePort;

module.exports = mock;

