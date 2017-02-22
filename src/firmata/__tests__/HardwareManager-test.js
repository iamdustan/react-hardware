
import {Firmata} from 'mock-firmata';
import {
  setPayloadForPin,
  validatePayloadForPin,
} from '../HardwareManager';

describe('HardwareManager', () => {

  describe('validatePayloadForPin', () => {
    let hw;
    beforeEach(() => {
      // default Firmata pin mapping is an Uno
      hw = new Firmata();
    });

    it('should handle an easy case', () => {
      expect(() => {
        validatePayloadForPin(
          {board: hw, readers: []},
          {
            pin: 0,
            value: 255,
            mode: 'DIGITAL',
          }
        );
      }).not.toThrow();
    });

    it('should throw for invalid pins', () => {
      const error = new Error(
        'Unsupported mode "ANALOG" for pin "0".\n' +
        'Supported modes are: "DIGITAL"'
      );
      error.name = 'Invariant Violation';

      expect(() => {
        validatePayloadForPin(
          {board: hw, readers: []},
          {
            pin: 0,
            value: 255,
            mode: 'ANALOG',
          }
        );
      }).toThrow(error);
    });

    it('should list all valid pins', () => {
      const error = new Error(
        'Unsupported mode "PWM" for pin "17".\n' +
        'Supported modes are: "INPUT", "OUTPUT", "ANALOG", "SERVO"'
      );
      error.name = 'Invariant Violation';

      expect(() => {
        validatePayloadForPin(
          {board: hw, readers: []},
          {
            pin: 17,
            value: 255,
            mode: 'PWM',
          }
        );
      }).toThrow(error);
    });
  });

  describe('setPayloadForPin', () => {
    let hw;
    beforeEach(() => {
      // default Firmata pin mapping is an Uno
      hw = new Firmata();
      // mock-firmata uses board-io that does not call this.addListener(...)
      hw.digitalRead = require('firmata').prototype.digitalRead.bind(hw);
      spyOn(hw, 'pinMode');
      spyOn(hw, 'digitalWrite');
      spyOn(hw, 'digitalRead').and.callThrough();
      spyOn(hw, 'analogWrite');
      spyOn(hw, 'analogRead');
      spyOn(hw, 'servoWrite');
      spyOn(hw, 'servoConfig');
    });

    it('should handle an easy case', () => {
      const payload = {
        pin: 0,
        value: 255,
        mode: 'INPUT',
      };

      setPayloadForPin(
        {board: hw, readers: []},
        payload
      );

      expect(hw.pinMode).toHaveBeenCalled();
      expect(hw.digitalWrite).toHaveBeenCalledWith(
        payload.pin,
        payload.value
      );
    });

    it('should handle setting up read handlers', () => {
      const noop = () => {};
      const payload = {
        pin: 0,
        value: 255,
        mode: 'OUTPUT',
        onRead: noop,
      };

      const connection = {board: hw, readers: []};
      setPayloadForPin(connection, payload);

      expect(hw.pinMode).toHaveBeenCalled();
      expect(hw.digitalWrite).toHaveBeenCalledWith(
        payload.pin,
        payload.value
      );

      expect(hw.digitalRead.calls.first().args[0]).toBe(payload.pin);
      expect(connection.readers[0].call).toBe(payload.onRead);
    });

    it('should handle servo write', () => {
      const payload = {
        pin: 0,
        value: 120,
        mode: 'SERVO',
      };
      const connection = {board: hw, readers: []};
      setPayloadForPin(connection, payload);
      expect(hw.servoWrite).toHaveBeenCalledWith(0, 120);
    });

    it('should map servo properties to servoConfig', () => {
      const payload = {
        pin: 0,
        value: 120,
        mode: 'SERVO',
        min: 0,
        max: 180,
      };
      const connection = {board: hw, readers: []};
      setPayloadForPin(connection, payload);
      expect(hw.servoConfig).toHaveBeenCalledWith(0, 0, 180);
      expect(hw.servoWrite).toHaveBeenCalledWith(0, 120);
    });

    it('should handle changing read handlers', () => {
      const before = jasmine.createSpy('before');
      const after = jasmine.createSpy('after');
      const initialPayload = {
        pin: 0,
        mode: 'OUTPUT',
        onRead: before,
      };

      const updatePayload = {
        pin: 0,
        mode: 'OUTPUT',
        onRead: after,
      };
      const connection = {board: hw, readers: []};
      setPayloadForPin(connection, initialPayload);
      expect(hw.pinMode).toHaveBeenCalled();
      expect(hw.digitalRead).toHaveBeenCalledTimes(1);
      hw.emit('digital-read-0', Infinity);
      expect(initialPayload.onRead).toHaveBeenCalledWith(Infinity);

      setPayloadForPin(connection, updatePayload);
      hw.emit('digital-read-0', 3.1415);
      expect(updatePayload.onRead).toHaveBeenCalledWith(3.1415);
      expect(connection.readers[0].call).toBe(after);
      expect(hw.digitalRead).toHaveBeenCalledTimes(1);
    });
  });
});

