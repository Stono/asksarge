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
    ['Section 117', 'section117']
  ].forEach(testCase => {
    it(`${testCase[0]} should convert to ${testCase[1]}`, () => {
      const result = sanitiser.clean(testCase[0]);
      should(result).eql(testCase[1]);
    });
  });
});