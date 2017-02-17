import React from 'react';
import * as HardwareManager from '../HardwareManager';
import ReactHardwareComponent from '../ReactHardwareComponent';
import ReactHardwareReconcileTransaction from '../ReactHardwareReconcileTransaction';

describe('ReactHardwareComponent', () => {
  it('should warn if it gets an unknown type', () => {
    spyOn(console, 'error');
    new ReactHardwareComponent({type: 'foo'}); // eslint-disable-line no-new
    expect(console.error).toHaveBeenCalledWith(
      'Warning: Attempted to render an unsupported generic component "foo". ' +
      'Must be "pin" or "container".'
    );

  });

  xdescribe('mountComponent', () => {
    it('should mount component', () => {
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

      expect(willMount).toHaveBeenCalled();
      expect(didMount).toHaveBeenCalled();
    });
  });

  describe('receiveComponent', function() {
    let gen;
    beforeEach(() => {
      gen = function(type, props) {
        const component = new ReactHardwareComponent({type, props});
        component._rootNodeID = 'test';
        return component;
      };
    });

    it('should receive component', () => {
      spyOn(HardwareManager, 'validatePayloadForPin');
      spyOn(HardwareManager, 'setPayloadForPin');
      const transaction = new ReactHardwareReconcileTransaction();

      const inst = gen('pin', {pin: 13, value: 255});
      expect(inst._currentElement.props.pin).toBe(13);
      expect(inst._currentElement.props.value).toBe(255);

      inst.receiveComponent(gen('pin', {pin: 13, value: 0})._currentElement, transaction, {});

      expect(inst._currentElement.props.pin).toBe(13);
      expect(inst._currentElement.props.value).toBe(0);
    });

    it('should warn if attempting to change pin', () => {
      const transaction = new ReactHardwareReconcileTransaction();

      const inst = gen('pin', {pin: 13, value: 255});
      expect(_ => {
        inst.receiveComponent(gen('pin', {pin: 14, value: 255})._currentElement, transaction, {});
      }).toThrow(
        new Error(
          'A mounted component cannot be mounted into a new Pin. The `pin` ' +
          'attribute is immutable.'
        )
      );
    });
  });
});
