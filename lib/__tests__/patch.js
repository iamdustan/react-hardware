
jest.dontMock('react/lib/ExecutionEnvironment');
jest.dontMock('../patch');

describe('Monkey patches React core', function() {
  describe('ExecutionEnvironment', function() {

    it('should have default values', _ => {
      var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');
      expect(ExecutionEnvironment.canUseDOM).toBe(true);
      expect(ExecutionEnvironment.canUseWorkers).toBe(false);
      expect(ExecutionEnvironment.canUseEventListeners).toBe(true);
      expect(ExecutionEnvironment.canUseViewport).toBe(true);
      expect(ExecutionEnvironment.isInWorker).toBe(false);
    });

    it('should have patched values', _ => {
      require('../patch').patchReact();
      var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');

      expect(ExecutionEnvironment.canUseDOM).toBe(false);
      expect(ExecutionEnvironment.canUseWorkers).toBe(false);
      expect(ExecutionEnvironment.canUseEventListeners).toBe(false);
      expect(ExecutionEnvironment.canUseViewport).toBe(false);
      expect(ExecutionEnvironment.isInWorker).toBe(true);
    });
  });

});

