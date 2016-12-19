import MemoryFS from 'memory-fs';
import webpack from 'webpack';
import http from 'http';
import path from 'path';
import {readFile, stat} from 'fs';

const last = a => a[a.length - 1];

const fs = new MemoryFS();
const compiler = webpack({
  entry: path.join(__dirname, 'script.js'),
  output: {
    path: path.resolve(__dirname),
    filename: 'script.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        query: {presets: ['react', 'es2015']},
      },
    ],
  },
});

compiler.outputFileSystem = fs;

compiler.watch({}, compiled);
// compiler.run(compiled);

function compiled(err, stats) {
  if (err) {
    throw err;
  }
  const jsonStats = stats.toJson();
  if (jsonStats.errors.length > 0) {
    jsonStats.errors.forEach(console.error);
    return;
  }
  if (jsonStats.warnings.length > 0) {
    jsonStats.warnings.forEach(console.warn);
  } else {
    console.log('Webpack compiled sucessfully');
  }
}


new http.createServer((req, res) => {
  function reply(path, contents) {
    let contentType = '';
    switch (last(path.split('.'))) {
      case 'js': contentType = 'application/javascript'; break;
      case 'html':
      case '': contentType = 'text/html';
    }
    res.writeHead(200, {
      'Content-Type': contentType + '; charset=utf-8',
    });
    res.end(contents);
  }

  const maybeFile = path.join(
    __dirname,
    (req.url === '' || req.url === '/') ? 'index.html' : req.url
  );

  try {
    const contents = fs.readFileSync(maybeFile).toString();
    reply(maybeFile, contents);
  } catch (e) {
    stat(maybeFile, (err, stats) => {
      readFile(maybeFile, 'utf8', (err, contents) => {
        reply(maybeFile, contents);
      });
    });
  }
}).listen(9000, '127.0.0.1', () => {
  console.log('Speech recognizer webpack on localhost:9000');
});
