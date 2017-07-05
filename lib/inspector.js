'use strict';
const Sanitiser = require('./sanitiser');
const async = require('async');
const debug = require('debug')('ig:inspector');
module.exports = function Inspector(options) {
  let self = {};
  const google = options.google;
  const data = options.data;
  const sanitiser = new Sanitiser();

/*
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

*/

  self.answer = function(question, done)  {
    let syntax;
    const handleCleaned = (results, done) => {
      debug('cleaned result:', results);
      question = results;
      done(null, question);
    };
/*
    const handleEntities = (results, done) => {
      debug('entities result:', results);
      entities = results;
      done(null, question);
    };
*/
    const handleSyntax = (results, done) => {
      debug('syntax result:', results);
      syntax = results;
      done(null, question);
    };
    const doCleverShit = (question, done) => {
      const nouns = syntax
      .filter(f => { return (f.partOfSpeech.tag === 'NOUN'); })
      .map(m => { return m.lemma; });
      debug('the following nouns were identified', nouns);
      data.matchByTags(nouns, done);
    };

    const start = next => { next(null, question); };
    async.waterfall([
      start,
      sanitiser.clean,
      handleCleaned,
//      google.getEntities,
//      handleEntities,
      google.getSyntax,
      handleSyntax,
      doCleverShit
    ], done);
  };

  return Object.freeze(self);
};
