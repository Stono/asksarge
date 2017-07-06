'use strict';
const async = require('async');

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
    async.series([
      data.loadDataFromFiles,
      data.populateElasticsearch,
      server.start
    ], done);
  };
  self.stop = function(done) {
    server.stop(done);
  };
  return Object.freeze(self);
};
