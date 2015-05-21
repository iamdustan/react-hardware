import {PropTypes} from '../ReactHardware';

var defaultPropTypes = {
  pin: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  mode: PropTypes.number,
};

export default defaultPropTypes;

