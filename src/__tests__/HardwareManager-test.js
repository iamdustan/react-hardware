
import {Firmata} from 'mock-firmata';
import {
  setPayloadForPin,
  validatePayloadForPin
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
          {board: hw},
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
          {board: hw},
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
          {board: hw},
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
      spyOn(hw, 'analogWrite');
    });

    it('should handle an easy case', () => {
      const payload = {
        pin: 0,
        value: 255,
        mode: 'INPUT',
      };

      setPayloadForPin(
        {board: hw},
        payload
      );

      expect(hw.pinMode).toHaveBeenCalled();
      expect(hw.digitalWrite).toHaveBeenCalledWith(
        payload.pin,
        payload.value
      );
    });
  });
});

