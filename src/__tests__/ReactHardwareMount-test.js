
// HACK: no idea why, but if we import react with es6 modules the tests all fail
// with `Invariant Violation: React DOM tree root should always have a node
// reference.` Also, this *must* come first.
const React = require('react');

import ReactHardwareMount from '../ReactHardwareMount';
import ReactHardwareDefaultInjection from '../ReactHardwareDefaultInjection';
ReactHardwareDefaultInjection.inject();

describe('ReactHardwareMount', () => {
  const PIN_DEFAULT_PROPS = {
    pin: 13,
    value: 255,
    mode: 'OUTPUT',
  };

  afterEach(() => {
    ReactHardwareMount._emptyCache();
  });

  describe('render', () => {
    it('should validate `nextElement`', () => {
      spyOn(console, 'error');
      // TODO make this validate it's a ReactHardwareComponent
      expect(
        _ => ReactHardwareMount.render(React.createElement('pin', PIN_DEFAULT_PROPS))
      ).not.toThrow();

      expect(
        _ => ReactHardwareMount.render()
      ).toThrowError(
        'ReactHardware.render(): Invalid component element.'
      );
    });

    it('should validate `container` port', () => {
      spyOn(console, 'error');
      const element = React.createElement('pin', PIN_DEFAULT_PROPS);

      ReactHardwareMount.render(element, '/dev/usb.whatever');
      expect(console.error).not.toHaveBeenCalled();

      ReactHardwareMount.render(element, '/dev/tty.Bluetooth-Incoming-Port');
      expect(console.error).toHaveBeenCalledWith('Warning: Attempting to render into a possibly invalid port: /dev/tty.Bluetooth-Incoming-Port');
    });

    it('should connect to the board', (done) => {
      const element = React.createElement('pin', PIN_DEFAULT_PROPS);

      ReactHardwareMount.render(element, '/dev/usb.whatever', function(inst) {
        expect(inst).toBeDefined();
        done();
      });
    });

    it('should warn when attempting to render into CONNECTING board', () => {
      spyOn(console, 'error');
      const element = React.createElement('pin', PIN_DEFAULT_PROPS);

      ReactHardwareMount.render(element, '/dev/usb.whatever');
      ReactHardwareMount.render(element, '/dev/usb.whatever');

      expect(console.error).toHaveBeenCalledWith(
        'Warning: Attempting to render to port `' + '/dev/usb.whatever' + '` that is in the process of mounting. ' +
        'You should wait until ReactHardware(comp, port, callback) callback is ' +
        'called to render again'
      );
    });

    it('should not warn when rerendering into a mounted component', (done) => {
      spyOn(console, 'error').and.callFake((...args) => {
        console.log(...args);
      });
      const element = React.createElement('pin', PIN_DEFAULT_PROPS);

      ReactHardwareMount.render(element, '/dev/usb.whatever', function() {
        expect(console.error).not.toHaveBeenCalledWith('lol');
        done();
      });
    });

    // Maybe move these to ReactHardwareComponent-test.js
    describe('Lifecycle tests', function() {
      it('simple lifecycle test', (done) => {
        const willMount = jasmine.createSpy();
        const didMount = jasmine.createSpy();
        class Component extends React.Component { // eslint-disable-line
          componentWillMount() {
            willMount();
          }
          componentDidMount() {
            didMount();
          }
          render() {
            return <pin pin={13} value={255} mode={'OUTPUT'} />;
          }
        }

        ReactHardwareMount.render(<Component />, '/dev/usb.whatever', () => {
          expect(willMount).toHaveBeenCalled();
          setTimeout(() => {
            expect(didMount).toHaveBeenCalled();
            done();
          });
        });
      });
    });
  });
});

