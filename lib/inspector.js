'use strict';
const Sanitiser = require('./sanitiser');
const async = require('async');
const debug = require('debug')('ig:inspector');
module.exports = function Inspector(options) {
  let self = {};
  const google = options.google;
  const data = options.data;
  const sanitiser = new Sanitiser();

  const splitEntitiesIntoWords = (entities, done) => {
    done(null, entities.split(' '));
  };

  const handleSyntax = (results, done) => {
    const extractLemma = item => {
      return item.lemma;
    };
    const message = results
    .map(extractLemma)
    .join(' ');
    debug('syntax result:', message);
    done(null, message);
  };

  const handleEntities = (results, done) => {
    debug('entities result:', results);
    done(null, results.join(' '));
  };

  self.answer = function(question, done)  {
    const start = next => { next(null, question); };
    async.waterfall([
      start,
      sanitiser.clean,
      google.getEntities,
      handleEntities,
      google.getSyntax,
      handleSyntax,
      splitEntitiesIntoWords,
      data.matchByTags
    ], done);
  };

  return Object.freeze(self);
};
