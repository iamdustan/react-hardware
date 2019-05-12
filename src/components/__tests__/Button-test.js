import * as React from 'react';
import Button from '../Button';
import TestRenderer from 'react-test-renderer';

const props = {
  pin: 6,
  onChange: jest.fn(),
  onDown: jest.fn(),
  onUp: jest.fn(),
  internalPullup: false,
};

let component;
let view;

describe('Standard input', () => {
  beforeEach(() => {
    component = TestRenderer.create(<Button {...props} />);
    view = component.toJSON();
  });

  it('should call onDown when the button is pressed', () => {
    view.props.onRead(1);
    view = component.toJSON();
    expect(props.onDown).toBeCalledWith({type: "down", value: 1});
    expect(props.onUp).not.toBeCalled();
  });

  it('should call onUp when the button is raised', () => {
    view.props.onRead(0);
    view = component.toJSON();
    expect(props.onDown).not.toBeCalled();
    expect(props.onUp).toBeCalledWith({type: "up", value: 0});
  });
});

describe('Internal Pull-Up Set', () => {
    beforeEach(() => {
      component = TestRenderer.create(<Button {...props} internalPullup />);
      view = component.toJSON();
    });
  
    it('should call onDown when the button is pressed', () => {
      view.props.onRead(0);
      view = component.toJSON();
      expect(props.onDown).toBeCalledWith({type: "down", value: 1});
      expect(props.onUp).not.toBeCalled();
    });
  
    it('should call onUp when the button is raised', () => {
      view.props.onRead(1);
      view = component.toJSON();
      expect(props.onDown).not.toBeCalled();
      expect(props.onUp).toBeCalledWith({type: "up", value: 0});
    });
  });
