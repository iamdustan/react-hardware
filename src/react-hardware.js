import ReactHardware from './ReactHardware';
import ArduinoUno from './boards/ArduinoUno';
import Leonardo from './boards/Leonardo';
import Mega from './boards/Mega';
import Board from './components/Board';
import Button from './components/Button';
import Led from './components/Led';
import Potentiometer from './components/Potentiometer';
import Servo from './components/Servo';
import Switch from './components/Switch';

export default {
  ...ReactHardware,
  ArduinoUno,
  Leonardo,
  Mega,
  Board,
  Button,
  Led,
  Potentiometer,
  Servo,
  Switch,
};

