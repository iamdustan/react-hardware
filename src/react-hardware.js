import ReactHardware from './ReactHardware';
import ArduinoUno from './boards/ArduinoUno';
import Board from './components/Board';
import Button from './components/Button';
import Led from './components/Led';
import Potentiometer from './components/Potentiometer';
import Servo from './components/Servo';
import Switch from './components/Switch';

export default {
  ...ReactHardware,
  ArduinoUno,
  Board,
  Button,
  Led,
  Potentiometer,
  Servo,
  Switch,
};

