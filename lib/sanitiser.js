'use strict';
const debug = require('debug')('ig:sanitiser');

module.exports = function Sanitiser() {
  const commonReplacements = question => {
    const replace = {
      'definition ': 'definition of ',
      'define ': 'definition of ',
      ' & ': ' and '
    };
    Object.keys(replace).forEach(key => {
      question = question.replace(new RegExp(key), replace[key]);
    });
    return question;
  };

  const mergeSections = question => {
    const result = question.match(/[s|S]ection\ \d+/);
    if(result !== null) {
      question = question.replace(result[0], result[0].replace(' ', '').toUpperCase());
    }
    return question;
  };

  let self = {};
  self.clean = function(question, done) {
    debug('sanitising', question);
    question = commonReplacements(question);
    question = mergeSections(question);
    debug('sanitisation result', question);
    done(null, question);
  };
  return Object.freeze(self);
};
