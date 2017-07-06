'use strict';
const should = require('should');
const Data = require('../lib/data');

describe('Data', () => {
  let data = new Data();
  data.loadDataFromFiles(() => {

    const expectedTypes = {
      definitions: 2,
      powers: 11,
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
            it(`${power.name}`, () => {
              should(Object.keys(power).sort()).eql(['data', 'name', 'tags', 'type']);
            });
          });
        });
      });
    });

    describe('find by tags', () => {
      it('should not return items with no matching tags', done => {
        data.matchByTags(['akwjndkajwdnkajwndk'], (err, results) => {
          should(results.length).eql(0);
          done();
        });
      });
      it('should score items as what percentage of their tags match the query', done => {
        data.addData({
          name: 'test',
          tags: ['some', 'other', 'tags', 'akwjndkajwdnkajwndk'],
          data: 'testing'
        });
        data.matchByTags(['akwjndkajwdnkajwndk'], (err, results) => {
          should(results[0].name).eql('test');
          should(results[0].score).eql(25);
          done();
        });
      });

    });
  });
});
