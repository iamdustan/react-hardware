import React from 'react';
import * as HardwareManager from '../HardwareManager';
import ReactHardwareComponent from '../ReactHardwareComponent';
import ReactHardwareReconcileTransaction from '../ReactHardwareReconcileTransaction';

describe('ReactHardwareComponent', () => {
  xdescribe('mountComponent', () => {
    it('should mount component', function() {
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
    beforeEach(function() {
      const NodeStub = function(initialProps) {
        this._currentElement = {props: initialProps};
        this._rootNodeID = 'test';
      };
      NodeStub.prototype = new ReactHardwareComponent({
        validAttributes: {
          pin: true,
          value: true,
        },
      });

      Object.assign(NodeStub.prototype, ReactHardwareComponent.Mixin);

      gen = function(props) {
        return new NodeStub(props);
      };
    });

    it('should receive component', function() {
      spyOn(HardwareManager, 'validatePayloadForPin');
      spyOn(HardwareManager, 'setPayloadForPin');
      const transaction = new ReactHardwareReconcileTransaction();

      const inst = gen({pin: 13, value: 255});
      expect(inst._currentElement.props.pin).toBe(13);
      expect(inst._currentElement.props.value).toBe(255);

      inst.receiveComponent(gen({pin: 13, value: 0})._currentElement, transaction, {});

      expect(inst._currentElement.props.pin).toBe(13);
      expect(inst._currentElement.props.value).toBe(0);
    });

    it('should warn if attempting to change pin', function() {
      const transaction = new ReactHardwareReconcileTransaction();

      const inst = gen({pin: 13, value: 255});
      expect(_ => {
        inst.receiveComponent(gen({pin: 14, value: 255})._currentElement, transaction, {});
      }).toThrow(
        new Error(
          'A mounted component cannot be mounted into a new Pin. The `pin` ' + 
          'attribute is immutable. Check the render function of undefined.'
        )
      );
    });
  });
});

