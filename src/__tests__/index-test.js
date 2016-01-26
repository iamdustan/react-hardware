/* eslint-disable */

'use strict';

describe('ReactHardware Integration', () => {
  const React = require('react');
  const ReactHardware = require('../index')['default'];
  const ReactHardwareMount = require('../ReactHardwareMount')['default'];

  let Board;
  let Pin;

  beforeEach(() => {
    ({Board, Pin} = ReactHardware);
  });

  afterEach(() => {
    ReactHardwareMount._emptyCache();
  });

  it('should handle a simple flow with reusing the root node', (done) => {
    const container = '/dev/cu.usbmodem1451';
    ReactHardware.render(
      <pin pin={13} value={0} mode={'INPUT'} />,
      container,
      (inst) => {
        expect(inst).toBeDefined();
        const {props} = inst._currentElement;
        expect(props.pin).toBe(13);
        expect(props.value).toBe(0);
        expect(props.mode).toBe('INPUT');

        diffs();
      }
    );

    function diffs() {
      ReactHardware.render(
        <pin pin={13} value={1} mode={'INPUT'} />,
        container,
        (inst) => {
          // TODO: verify child pin attributes
          expect(inst).toBeDefined();
          const {props} = inst._currentElement;
          expect(props.pin).toBe(13);
          expect(props.value).toBe(1);
          expect(props.mode).toBe('INPUT');

          ReactHardware.unmountComponentAtNode(container);
          done();
        }
      );
    }
  });
});

