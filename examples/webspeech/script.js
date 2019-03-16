import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const ws = new WebSocket('ws://localhost:8098');
ws.onopen = () => console.log('Websocket connection opened');
ws.onmessage = ({data}) => console.log(data);

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList; // eslint-disable-line
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const last = a => a[a.length - 1];

type S = {
  status: string,
  hearing: string,
  heard: Array<string>,
};

class App extends Component<any, any, S> {
  constructor() {
    super();

    this.state = {
      status: '',
      hearing: '',
      heard: [],
    };

    this.startTimestamp = null;
    this.onClick = this.onClick.bind(this);
    this.onResult = this.onResult.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  handleCommand(maybeCommand: string) {
    if (/\bon\b/i.test(maybeCommand)) {
      ws.send('on');
    } else if (/\boff\b/i.test(maybeCommand)) {
      ws.send('off');
    } else if (/\bbrighter\b/i.test(maybeCommand)) {
      ws.send('brighter');
    } else if (/\bdi[mn]+er|softer\b/i.test(maybeCommand)) {
      ws.send('dimmer');
    }
  }

  componentWillMount() {
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.onerror = event => {
      if (event.error === 'no-speech') {
        this.setState({error: 'no-speech'});
      }
      if (event.error === 'audio-capture') {
        this.setState({error: 'No microphone detected.'});
      }
      if (event.error === 'not-allowed') {
        if (event.timeStamp - this.startTimestamp < 100) {
          this.setState({error: 'Something went wrong.'});
        } else {
          this.setState({error: 'Microphone access was disallowed.'});
        }
      }
    };
  }

  componentWillUnmount() {
    this.recognition.stop();
    this.recognition = null;
  }

  onClick(event: any) {
    if (this.state.status === 'LISTENING') {
      this.recognition.stop();
      this.setState({status: ''});
    } else {
      this.startTimestamp = event.timeStamp;
      this.recognition.start();
      this.setState({status: 'LISTENING'});
      this.recognition.onresult = this.onResult;
      this.recognition.onend = this.onEnd;
    }
  }

  onEnd(event: any) {
    this.setState({status: '', hearing: ''});
  }

  onResult(event: any) {
    [...event.results].reverse().some(r => {
      if (r.isFinal) {
        const maybeCommand = r[0].transcript;
        this.setState({heard: [maybeCommand].concat(this.state.heard)});
        this.handleCommand(maybeCommand);
        return true;
      }
    });

    this.setState({hearing: last(event.results)[0].transcript});
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{background: 'yellow', padding: '0.75em', overflow: 'hidden'}}
        >
          <strong
            style={{float: 'left', fontSize: '2em', marginRight: '0.5em'}}
          >
            :‘(
          </strong>
          <span>
            It looks like your browser does not support the{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition">
              SpeechRecognition
            </a>{' '}
            API.
          </span>
        </div>
      );
    }

    return (
      <div>
        <button onClick={this.onClick}>
          {this.state.status === '' ? 'Start Listening' : 'Stop Listening'}
        </button>
        <div id="ear">
          <span>Currently hearing: </span>
          <span>{this.state.hearing}</span>
        </div>
        <div id="log">
          <span>Everything heard: </span>
          <ul>
            {this.state.heard.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

const Noapp = () => (
  <div style={{background: 'yellow', padding: '0.75em', overflow: 'hidden'}}>
    <strong style={{float: 'left', fontSize: '2em', marginRight: '0.5em'}}>
      :‘(
    </strong>
    <span>
      It looks like your browser does not support the{' '}
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition">
        SpeechRecognition
      </a>{' '}
      API.
    </span>
  </div>
);

ReactDOM.render(
  SpeechRecognitionEvent ? <App /> : <Noapp />,
  document.getElementById('app'),
);
