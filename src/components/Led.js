/**
 * ReactHardware Led component for rendering an Led. Currently it’s simply an
 * alias for a <pin />
 *
 * <Led value={100} pin={13} mode="OUTPUT" />
 *
 * @flow
 **/

import * as React from 'react';

const Led = (props: *) => <pin {...props} />;
Led.displayName = 'Led';

export default Led;
