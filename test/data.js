'use strict';
const should = require('should');
const Data = require('../lib/data');

describe('Data', () => {
  let data = new Data();

  const expectedTypes = {
    definitions: 2,
    powers: 4,
    numbers: 3
  };

  describe('Loading definitions', () => {
    Object.keys(expectedTypes).forEach(type => {
      it(`${type} should have ${expectedTypes[type]} entries`, done => {
        data.byType(type, (err, data) => {
          should.ifError(err);
          should(data.length).eql(expectedTypes[type]);
          done();
        });
      });
    });
  });

  describe('Data Contracts',  () => {

    describe('Powers', () => {
      data.byType('powers', (err, data) => {
        data.forEach(power => {
          it(`${power.name} should match the contract of a power`, () => {
            should(Object.keys(power).sort()).eql(['data', 'name', 'tags', 'type']);
          });
        });
      });
    });

  });
});
