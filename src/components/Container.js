/**
 * ReactHardware Container component for rendering multiple children.
 *
 * <Container>
 *   <pin value={100} pin={13} mode="OUTPUT" />
 *   <pin value={50} pin={12} mode="OUTPUT" />
 * </Container>
 *
 * @flow
 **/
import React from 'react';

class Container extends React.Component {
  render() {
    return (
      <container>
        {this.props.children}
      </container>
    );
  }
}

Container.displayName = 'Container';

export default Container;
