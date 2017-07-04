'use strict';
const express = require('express');
const util = require('./util');
const debug = require('debug')('ig:server');
const bodyParser = require('body-parser');
const glob = require('glob');
const path = require('path');

module.exports = function Server(options) {
  util.enforceArgs(options, [
    'inspector'
  ]);

  const app = express();
  const http = require('http').Server(app);
  const io = require('socket.io')(http);

  const handleSocketConnection = socket => {
    let queue = [];
    const send = msg => {
      queue.unshift(msg);
    };

    setInterval(() => {
      const msg = queue.pop();
      if(msg) {
        socket.emit('message', msg);
      }
    }, 700);

    const tooManyResults = () => {
      send('You\'re gonna need to give me more details mate, theres too many ways I can answer that question');
    };
    const noResults = () => {
      send('Not got a clue what you\'re on about fella');
      send('Try asking me about powers, or acronym definitions, stuff like that.');
    };
    const singleResult = row => {
      if(row.name) {
        send(row.name);
      }
      send(row.data);
    };
    const multipleResults = rows => {
      send('You\'re gonna have to be a bit more specific fella.  I can think of a few things to talk about here, for example:');
      rows.forEach(row => {
        send(row.name);
      });
    };
    socket.on('question', data => {
      /* jshint maxcomplexity: 10 */
      options.inspector.answer(data, (err, result) => {
        if(result.length > 5) {
          return tooManyResults();
        }
        if(result.length === 0) {
          return noResults();
        }
        if(result.length > 1) {
          return multipleResults(result);
        }
        singleResult(result[0]);
      });
    });
    send('Alright pal, what do you need?');
  };
  io.on('connection', handleSocketConnection);

  const cookieParser = require('cookie-parser')();

  (function expressSetup() {
    app.use(cookieParser);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use('/js', express.static('public/js'));
    app.use('/dist/js', express.static('dist/js'));

    app.use('/css', express.static('public/css'));
    app.use('/dist/css', express.static('dist/css'));

    app.use('/fonts', express.static('public/fonts'));
    app.use('/dist/fonts', express.static('dist/fonts'));

    app.use('/images', express.static('images'));

    app.set('views', __dirname + '/../views');
    app.set('view engine', 'pug');
  })();

  (function applyRoutes() {
    const middleware = function(req, res, next) {
      debug(`${req.method} ${req.path}`);
      next();
    };
    app.use(middleware);

    const controllerConfig = {};
    const controllerFiles = glob.sync(path.join(__dirname, 'controllers/*.js'));
    controllerFiles.forEach(path => {
      const file = path.split('/').reverse()[0];
      const controller = new require(path)(controllerConfig);
      require(`./routes/${file}`)(app, controller);
    });
  })();

  let self = {
    app: app
  };
  self.start = function(done) {
    debug(`server started on port ${options.port}`);
    http.listen(options.port, done);
  };
  self.stop = function(done) {
    http.close();
    done();
  };
  return Object.freeze(self);
};
