import setupDevtools from './setupDevtools';

if (typeof GLOBAL === 'undefined') {
  global.GLOBAL = this;
}

if (typeof window === 'undefined') {
  global.window = GLOBAL;
}

if (!window.document) {
  setupDevtools();
}

