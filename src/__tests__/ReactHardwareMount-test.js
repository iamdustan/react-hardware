
import React from 'react';
import ReactHardwareMount from '../ReactHardwareMount';

describe('ReactHardwareMount', () => {
  afterEach(() => {
    ReactHardwareMount._emptyCache();
  });

  describe('render', () => {
    it('should validate `nextElement`', () => {
      spyOn(console, 'error');
      // TODO make this validate it's a ReactHardwareComponent
      expect(
        _ => ReactHardwareMount.render(React.createElement('pin'))
      ).not.toThrow();

      expect(
        _ => ReactHardwareMount.render()
      ).toThrowError(
        'ReactHardware.render(): Invalid component element.'
      );
    });

    it('should validate `container` port', () => {
      spyOn(console, 'error');
      const element = React.createElement('pin');

      ReactHardwareMount.render(element, '/dev/usb.whatever');
      expect(console.error).not.toHaveBeenCalled();

      ReactHardwareMount.render(element, '/dev/tty.Bluetooth-Incoming-Port');
      expect(console.error).toHaveBeenCalledWith('Warning: Attempting to render into a possibly invalid port: /dev/tty.Bluetooth-Incoming-Port');
    });

    it('should connect to the board', (done) => {
      const element = React.createElement('pin');

      ReactHardwareMount.render(element, '/dev/usb.whatever', function(inst) {
        expect(inst).toBeDefined();
        done();
      });
    });

    it('should warn when attempting to render into CONNECTING board', () => {
      spyOn(console, 'error');
      const element = React.createElement('pin');

      ReactHardwareMount.render(element, '/dev/usb.whatever');
      ReactHardwareMount.render(element, '/dev/usb.whatever');

      expect(console.error).toHaveBeenCalledWith(
        'Warning: Attempting to render to port `' + '/dev/usb.whatever' + '` that is in the process of mounting. ' +
        'You should wait until ReactHardware(comp, port, callback) callback is ' +
        'called to render again'
      );
    });

    it('should not warn when rerendering into a mounted component', (done) => {
      spyOn(console, 'error');
      const element = React.createElement('pin');

      ReactHardwareMount.render(element, '/dev/usb.whatever', function() {
        ReactHardwareMount.render(element, '/dev/usb.whatever');
        expect(console.error).not.toHaveBeenCalled();
        done();
      });
    });
  });
});

