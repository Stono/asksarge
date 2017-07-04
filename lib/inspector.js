'use strict';
const Sanitiser = require('./sanitiser');
const async = require('async');

module.exports = function Inspector(options) {
  let self = {};
  const google = options.google;
  const data = options.data;
  const sanitiser = new Sanitiser();

  const splitEntitiesIntoWords = (entities, done) => {
    const newArr = [];
    entities.forEach(e => {
      newArr.push.apply(newArr, e.split(' '));
    });
    done(null, newArr);
  };

  self.answer = function(question, done)  {
    async.waterfall([
      next => { sanitiser.clean(question, next); },
      google.getEntities,
      splitEntitiesIntoWords,
      data.matchByTags
    ], done);
  };

  return Object.freeze(self);
};
