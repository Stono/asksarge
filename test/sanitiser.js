'use strict';
const Sanitiser = require('../lib/sanitiser');
const should = require('should');

describe('Sanitiser', () => {
  let sanitiser;
  before(() => {
    sanitiser = new Sanitiser();
  });

  [
    ['section 117', 'SECTION117'],
    ['Section 117', 'SECTION117'],
    ['define gowisely', 'definition of gowisely'],
    ['stop & search', 'stop and search']
  ].forEach(testCase => {
    it(`${testCase[0]} should convert to ${testCase[1]}`, done => {
      sanitiser.clean(testCase[0], (err, result) => {
        should(result).eql(testCase[1]);
        done();
      });
    });
  });
});
