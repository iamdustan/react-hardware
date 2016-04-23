import React, {Component} from 'react';
import ReactHardware, {render, unmountComponentAtNode, Button} from '../';
import ReactHardwareMount from '../ReactHardwareMount';

describe('ReactHardware Integration', () => {
  afterEach(() => {
    ReactHardwareMount._emptyCache();
  });

  it('should export ReactHardware as default and individual exports', () => {
    expect(ReactHardware.Button).toBe(Button);
    expect(ReactHardware.render).toBe(render);
    expect(ReactHardware.unmountComponentAtNode).toBe(unmountComponentAtNode);
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

          unmountComponentAtNode(container);
          done();
        }
      );
    }
  });

  it('should render multiple children', (done) => {
    const container = '/dev/cu.usbmodem1451';
    class TestApplication extends Component {
      render() {
        return (
          <container>
            <pin pin={10} value={0} mode={'OUTPUT'} />
            <pin pin={11} value={0} mode={'OUTPUT'} />
            <pin pin={12} value={0} mode={'OUTPUT'} />
            <pin pin={13} value={0} mode={'OUTPUT'} />
          </container>
        );
      }
    }

    ReactHardware.render(
      <TestApplication />,
      container,
      (inst) => {
        const internalComponent = inst._reactInternalInstance._renderedComponent;
        const container = internalComponent._currentElement;
        const {children} = container.props;
        expect(children.length).toBe(4);
        done();
      }
    );
  });

  it('should support changing a child', (done) => {
    const container = '/dev/cu.usbmodem1451';
    class OtherPin extends Component {
      render() {
        return <pin pin={10} value={1} mode={'OUTPUT'} />;
      }
    }

    class TestApplication extends Component {
      constructor() {
        super();

        this.state = {swapped: false};
      }
      componentDidMount() {
        setTimeout(_ => this.setState({swapped: true}), 10);
      }

      componentDidUpdate() {
        done();
      }

      render() {
        if (this.state.swapped) {
          return <OtherPin ref={'other'} />;
        }

        return <pin pin={10} value={0} mode={'OUTPUT'} />;
      }
    }

    ReactHardware.render(
      <TestApplication />,
      container
    );
  });
});
