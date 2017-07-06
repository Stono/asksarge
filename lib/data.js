'use strict';
const glob = require('glob');
const path = require('path');
const debug = require('debug')('ig:data');

module.exports = function Data() {
  let data = [];
  let self = {};

  const mutate = (tags, entities, type, group) => {
    const groupTags = [];
    groupTags.push.apply(groupTags, tags || []);
    groupTags.push.apply(groupTags, group.tags || []);
    group.entities.forEach(e => {
      e.tags.push.apply(e.tags, groupTags);
      e.type = type;
      entities.push(e);
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
    /* jshint maxcomplexity: 5 */
    definitions.forEach(file => {
      const definition = require(file);
      const type = file.split('/').pop().split('.')[0];

      const tags = definition.tags || [];
      const entities = [];
      if(definition.groups) {
        definition.groups.forEach(group => {
          mutate(tags, entities, type, group);
        });
      }
      if(definition.entities) {
        mutate([], entities, type, definition);
      }
      self.addData(entities);
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
    tags = tags.map(m => { return m.toString().toLowerCase(); });
    debug('matching by tags', tags);
    const querySet = new Set(tags);
    const score = row => {
      const rowSet = new Set(row);
      const matchedRowTags = new Set([...rowSet].filter(x => querySet.has(x))).size;
      const unmatchedRowTags = rowSet.size - matchedRowTags;
      const score = (matchedRowTags === 0) ? null : matchedRowTags;
      return score;
    };

    let result = data.map(m => {
      m.score = score(m.tags);
      return m;
    }).filter(a => {
      return (a.score !== null);
    }).sort((a, b) => {
      a = a.score;
      b = b.score;
      if(a === b) { return 0 }
      return (a > b) ? -1 : 1;
    });
    const topScore = result.length === 0 ? 0 : result[0].score;
    result = result.filter(r => {
      return (r.score === topScore);
    });
    debug(`${result.length} results found with a relative score of ${topScore}`);
    result.forEach(r => {
      debug(` - ${r.name}, ${r.tags}`);
    });
    done(null, result);
  };

  return Object.freeze(self);
};

