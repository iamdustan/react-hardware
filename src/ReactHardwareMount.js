/**
 * React Hardware mount method.
 *
 * @flow
 */

// import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactElement from 'react/lib/ReactElement';
import ReactUpdates from 'react/lib/ReactUpdates';
import ReactUpdateQueue from 'react/lib/ReactUpdateQueue';
import ReactReconciler from 'react/lib/ReactReconciler';
import shouldUpdateReactComponent from 'react/lib/shouldUpdateReactComponent';
import instantiateReactComponent from 'react/lib/instantiateReactComponent';

import invariant from 'fbjs/lib/invariant';
import warning from 'fbjs/lib/warning';

import {Board} from 'firmata';

import ReactHardwareDefaultInjection from './ReactHardwareDefaultInjection';

import {connectionsByContainer} from './HardwareManager';

const TRANSIENT_CONTAINER_IDENTIFIER = '__AutomaticallyDiscoveredPort';

ReactHardwareDefaultInjection.inject();

const ReactHardwareMount = {
  /**
   * Renders a React component to the supplied `container` port.
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the pins as necessary to reflect
   * the latest React component.
   */
  render(
    nextElement: ReactElement,
    container: string = TRANSIENT_CONTAINER_IDENTIFIER,
    callback: ?Function
  ): void {
    // WIP: it appears as though nextElement.props is an empty object...
    invariant(
      ReactElement.isValidElement(nextElement),
      'ReactHardware.render(): Invalid component element.%s',
      (
        typeof nextElement === 'function' ?
          ' Instead of passing a component class, make sure to instantiate ' +
          'it by passing it to React.createElement.' :
        // Check if it quacks like an element
        nextElement != null && nextElement.props !== undefined ?
          ' This may be caused by unintentionally loading two independent ' +
          'copies of React.' :
          ''
      )
    );

    warning(
      typeof container === 'string' ? (
        container === TRANSIENT_CONTAINER_IDENTIFIER ||
        Board.isAcceptablePort({comName: container})
      ) : true,
      'Attempting to render into a possibly invalid port: %s',
      container
    );

    if (container) {
      const prevConnection = connectionsByContainer[container];

      if (prevConnection) {
        warning(
          prevConnection.status !== 'CONNECTING',
          'Attempting to render to port `%s` that is in the process of mounting. ' +
          'You should wait until ReactHardware(comp, port, callback) callback is ' +
          'called to render again',
          container
        );

        if (prevConnection.status === 'CONNECTED') {
          const prevComponent = prevConnection.component;
          if (prevComponent) {
            // $FlowFixMe
            const prevWrappedElement = prevComponent._currentElement;
            const prevElement = prevWrappedElement.props;
            if (shouldUpdateReactComponent(prevElement, nextElement)) {
              // $FlowFixMe
              const publicInst = prevComponent._renderedComponent.getPublicInstance();
              const updatedCallback = callback && function() {
                // appease flow
                if (callback) {
                  callback.call(publicInst);
                }
              };

              ReactHardwareMount._updateRootComponent(
                prevComponent,
                nextElement,
                container,
                updatedCallback
              );
              return publicInst;
            } else {
              warning(
                true,
                'Unexpected `else` branch in ReactHardware.render()'
              );
            }
          }
        }
      }
    }

    const id = 'TODO: generate IDs';
    // const id = ReactInstanceHandles.createReactRootID();
    connectionsByContainer[container] = {
      rootID: id,
      status: 'CONNECTING',
      component: null,
      board: null,
    };

    connect(container, (board, resolvedPort) => {
      ReactHardwareMount._renderNewRootComponent(
        id,
        resolvedPort,
        nextElement,
        board,
        callback
      );
    });
  },

  /**
   * Unmounts a component.
   */
  unmountComponentAtNode(
    container: string
  ):boolean {
    const {component} = connectionsByContainer[container];
    if (!component) {
      return false;
    }
    // $FlowFixMe
    const instance = component.getPublicInstance();

    ReactReconciler.unmountComponent(instance);
    delete connectionsByContainer.component;
    // TODO: does Firmata support disconnect/cleanup events?
    return true;
  },

  /**
   * Take a component that’s already mounted and replace its props
   */
  _updateRootComponent(
    prevComponent: ReactComponent, // component instance already in the DOM
    nextElement: ReactElement, // component instance to render
    container: string, // firmata connection port
    callback: ?Function // function triggered on completion
  ):ReactComponent {
    ReactUpdateQueue.enqueueElementInternal(prevComponent, nextElement);
    if (callback) {
      ReactUpdateQueue.enqueueCallbackInternal(prevComponent, callback);
    }

    return prevComponent;
  },

  _renderNewRootComponent(
    rootID: string,
    container: string,
    nextElement: ReactElement,
    board: typeof Board, // Firmata instnace
    callback: ?Function
  ) {
    // FIXME: this should only be hit in testing when we
    // clear the connectionsByContainer cache. Totally a hack.
    if (!connectionsByContainer[container]) {
      return;
    }

    const component = instantiateReactComponent(nextElement);

    connectionsByContainer[container].status = 'CONNECTED';
    connectionsByContainer[container].component = component;
    connectionsByContainer[container].board = board;
    connectionsByContainer[container].rootID = rootID;

    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.
    ReactUpdates.batchedUpdates(() => {
      // Batched mount component
      const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
      transaction.perform(() => {
        component.mountComponent(transaction, rootID, null, {});
        if (callback) {
          const publicInst = component.getPublicInstance();
          callback(publicInst);
        }
      });
      ReactUpdates.ReactReconcileTransaction.release(transaction);
    });
  },

  /**
   * Empty connections by container. Used by test utils to get
   * a clean slate. Totally a bad hack.
   */
  _emptyCache() {
    Object.keys(connectionsByContainer).forEach(connection => {
      // TODO: actually disconnect
      delete connectionsByContainer[connection];
    });
  },
};

/**
  * Get or create a connection to a given port
  */
function connect(maybePort:string, callback:Function) {
  if (maybePort !== TRANSIENT_CONTAINER_IDENTIFIER) {
    connect(maybePort);
  } else {
    Board.requestPort((err, port) => {
      if (err) {
        throw err;
      } else {
        console.log(port.comName);
        // Remap the connection from transient state to the real port
        connectionsByContainer[port.comName] = connectionsByContainer[maybePort];
        delete connectionsByContainer[maybePort];
        connect(port.comName);
      }
    });
  }

  function connect(port) {
    const board = new Board(port, function(err) {
      if (err) {
        throw err;
      }

      callback(board, port);
    });
  }
}

export default ReactHardwareMount;

