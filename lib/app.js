'use strict';
module.exports = function App(config) {
  const google = new require('./google-language')();
  const data = new require('./data')();
  const inspector = new require('./inspector')({
    data: data,
    google: google,
    name: config.name
  });

  const server = new require('./server')({
    inspector: inspector,
    port: config.port
  });

  let self = {};
  self.start = function(done) {
    data.loadDataFromFiles(() => {
      server.start(done);
    });
  };
  self.stop = function(done) {
    server.stop(done);
  };
  return Object.freeze(self);
};
