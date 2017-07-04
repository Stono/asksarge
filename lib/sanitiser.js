'use strict';
const debug = require('debug')('ig:sanitiser');

module.exports = function Sanitiser() {
  const commonReplacements = question => {
    const replace = {
      define: 'definition'
    };
    Object.keys(replace).forEach(key => {
      question = question.replace(key, replace[key]);
    });
    return question;
  };

  const mergeSections = question => {
    const result = question.match(/[s|S]ection\ \d+/);
    if(result !== null) {
      question = question.replace(result[0], result[0].replace(' ', ''));
    }
    return question;
  };

  let self = {};
  self.clean = function(question, done) {
    debug('sanitising', question);
    question = question.toLowerCase();
    question = commonReplacements(question);
    question = mergeSections(question);
    debug('sanitisation result', question);
    done(null, question);
  };
  return Object.freeze(self);
};
