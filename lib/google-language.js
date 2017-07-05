'use strict';
const Language = require('@google-cloud/language');

module.exports = function GoogleLanguage() {
  let self = {};
  const language = new Language();

  const execute = (method, text, dataHandler, done) => {
    const document = language.document({ content: text });
    document[method]()
    .then(dataHandler)
    .catch(done);
  };

  self.getEntities = function(text, done) {
    const dataHandler = results => {
      const entities = results[1].entities;
      done(null, entities);
    };
    execute('detectEntities', text, dataHandler, done);
  };

  self.getSyntax = function(text, done) {
    const dataHandler = results => {
      const entities = results[0];
      done(null, entities.map(e => {
        const eachPart = k => {
          const val = e.partOfSpeech[k];
          if(val.toLowerCase().indexOf('_unknown') > -1) {
            delete e.partOfSpeech[k];
          }
        };
        Object.keys(e.partOfSpeech).forEach(eachPart);
        return e;
      }));
    };
    execute('detectSyntax', text, dataHandler, done);
  };

  return Object.freeze(self);
};
