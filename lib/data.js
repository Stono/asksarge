'use strict';
const glob = require('glob');
const path = require('path');
const debug = require('debug')('ig:data');

module.exports = function Data() {
  let data = [];
  let self = {};

  const mutate = (data, type) => {
    const tags = data.tags;
    data.entities.forEach(e => {
      e.tags.push.apply(e.tags, tags);
      e.type = type;
    });
  };

  self.addData = function(items) {
    if(items instanceof Array) {
      return data.push.apply(data, items);
    }
    data.push(items);
  };

  self.loadDataFromFiles = function(done) {
    const pathToData = path.join(__dirname, 'data/*.js');
    const definitions = glob.sync(pathToData);
    definitions.forEach(file => {
      const definition = require(file);
      const type = file.split('/').pop().split('.')[0];
      mutate(definition, type);
      self.addData(definition.entities);
    });
    done();
  };

  self.all = function(done) {
    done(null, data);
  };

  self.byType = function(type, done) {
    done(null, data.filter(d => { return d.type === type; }));
  };

  self.matchByTags = function(tags, done) {
    debug('matching by tags', tags);
    const querySet = new Set(tags);
    const score = row => {
      const rowSet = new Set(row);
      const diffSet = new Set([...rowSet].filter(x => !querySet.has(x)));
      const found = 100 - (diffSet.size/rowSet.size*100);
      return found;
    };

    let result = data.map(m => {
      m.score = score(m.tags);
      return m;
    }).filter(a => {
      return (a.score > 0);
    }).sort((a, b) => {
      return (a.score < b.score);
    });

    const topScore = result.length === 0 ? 0 : result[0].score;
    result = result.filter(r => {
      return (r.score === topScore);
    });

    debug(`${result.length} results found with a score of ${topScore}`);
    done(null, result);
  };

  return Object.freeze(self);
};

