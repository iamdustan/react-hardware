/**
 * ReactHardware Led component for rendering an Led. Currently it’s simply an
 * alias for a <pin />
 *
 * <Led value={100} pin={13} mode="OUTPUT" />
 *
 * @flow
 **/

import React, {Component} from 'react';

class Led extends Component {
  render() {
    return <pin {...this.props} />;
  }
}

Led.displayName = 'Led';

export default Led;
