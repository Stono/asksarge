'use strict';
const Sanitiser = require('../lib/sanitiser');
const should = require('should');

describe('Sanitiser', () => {
  let sanitiser;
  before(() => {
    sanitiser = new Sanitiser();
  });

  [
    ['section 117', 'section117'],
    ['Section 117', 'section117'],
    ['do we like questions?', 'do we like questions'],
    ['define gowisely', 'definition of gowisely']
  ].forEach(testCase => {
    it(`${testCase[0]} should convert to ${testCase[1]}`, done => {
      sanitiser.clean(testCase[0], (err, result) => {
        should(result).eql(testCase[1]);
        done();
      });
    });
  });
});
