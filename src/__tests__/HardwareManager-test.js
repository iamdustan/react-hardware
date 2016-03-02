
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
          { pin: 0,
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
          { pin: 0,
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
          { pin: 17,
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
      spyOn(hw, 'pinMode');
      spyOn(hw, 'digitalWrite');
      spyOn(hw, 'digitalRead');
      spyOn(hw, 'analogWrite');
      spyOn(hw, 'analogRead');
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
        reader: noop,
      };

      const connection = {board: hw, readers: []};
      setPayloadForPin(connection, payload);

      expect(hw.pinMode).toHaveBeenCalled();
      expect(hw.digitalWrite).toHaveBeenCalledWith(
        payload.pin,
        payload.value
      );

      expect(hw.digitalRead.calls.first().args[0]).toBe(payload.pin);
      expect(connection.readers[0].call).toBe(payload.reader);
    });

    // TODO: mock-firmata emit should work
    xit('should handle changing read handlers', () => {
      const before = jasmine.createSpy();
      const after = jasmine.createSpy();
      const initialPayload = {
        pin: 0,
        mode: 'OUTPUT',
        reader: before,
      };

      const updatePayload = {
        pin: 0,
        mode: 'OUTPUT',
        reader: after,
      };

      setPayloadForPin({board: hw, readers: []}, initialPayload);

      expect(hw.pinMode).toHaveBeenCalled();

      expect(hw.digitalRead).toHaveBeenCalledWith(initialPayload.pin, initialPayload.reader);
      hw.emit('digital-read-0', Infinity);
      expect(before).toHaveBeenCalledWith(Infinity);

      setPayloadForPin({board: hw}, updatePayload);
      hw.emit('digital-read-1', 3.1415);
      expect(before).toHaveBeenCalledWith(3.1415);
    });
  });
});

