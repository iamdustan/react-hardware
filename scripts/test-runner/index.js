require('babel-register');

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var SpecReporter = require('jasmine-spec-reporter');
var noop = function() {};

jasmine.loadConfig({
  spec_dir: './',
  spec_files: [
    'src/__tests__/*-test.js',
  ],
  helpers: [],
});

// remove default reporter logs
jasmine.configureDefaultReporter({print: noop});

// add jasmine-spec-reporter
jasmine.addReporter(new SpecReporter());

if (module.parent) {
  module.exports = jasmine;
} else {
  jasmine.execute();
}

