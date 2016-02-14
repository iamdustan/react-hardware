/**
 * React Hardware mount method.
 *
 * @flow
 */

import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
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
  // for react devtools
  _instancesByReactRootID: {},
  nativeTagToRootNodeID(nativeTag: number): string {
    throw new Error('TODO: implement nativeTagToRootNodeID ' + nativeTag);
  },

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
    callback?: ?(() => void)
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

    // const id = 'TODO: generate IDs';
    const id = ReactInstanceHandles.createReactRootID(container || 0);
    connectionsByContainer[container] = {
      rootID: id,
      status: 'CONNECTING',
      component: null,
      board: null,
    };

    const nextComponent = instantiateReactComponent(nextElement);
    connect(container, (board, resolvedPort) => {
      ReactHardwareMount.renderComponent(
        id,
        resolvedPort,
        nextComponent,
        nextElement,
        board,
        callback
      );
    });

    // needed for react-devtools
    ReactHardwareMount._instancesByReactRootID[id] = nextComponent;

    return nextComponent.getPublicInstance();
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
    prevComponent: Object, // component instance already in the DOM
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

  renderComponent(
    rootID: string,
    container: string,
    nextComponent: Object,
    nextElement: ReactElement,
    board: typeof Board, // Firmata instnace
    callback: ?Function
  ):?ReactComponent {
    // FIXME: this should only be hit in testing when we
    // clear the connectionsByContainer cache. Totally a hack.
    if (!connectionsByContainer[container]) {
      return nextComponent ? nextComponent.getPublicInstance() : null;
    }

    const component = nextComponent || instantiateReactComponent(nextElement);

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
        component.mountComponent(
          transaction,
          rootID,
          {_idCounter: 0},
          {}
        );
        if (callback) {
          const publicInst = component.getPublicInstance();
          callback(publicInst);
        }
      });
      ReactUpdates.ReactReconcileTransaction.release(transaction);
    });

    return component.getPublicInstance();
  },

  getNode(nativeTag: number): number {
    return nativeTag;
  },

  // needed for react devtools
  getID(nativeTag: number): string {
    const id = ReactInstanceHandles.getReactRootIDFromNodeID(nativeTag);
    console.warn('TODO: ReactHardwareMount.getID(%s) ->  %s', nativeTag, id);
    return id;
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
    console.info('Requesting port...');
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
    console.info('Connecting to port "%s"', port);
    const board = new Board(port, function(err) {
      if (err) {
        console.error('Failed connecting to port %s', port);
        throw err;
      }

      callback(board, port);
    });
  }
}

export default ReactHardwareMount;

