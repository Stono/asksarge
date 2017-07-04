'use strict';
const glob = require('glob');
const path = require('path');
const debug = require('debug')('ig:data');

module.exports = function Data() {

  const mutate = (data, type) => {
    const tags = data.tags;
    data.entities.forEach(e => {
      e.tags.push.apply(e.tags, tags);
      e.type = type;
    });
  };

  const data = (function generateData() {
    const pathToData = path.join(__dirname, 'data/*.js');
    const definitions = glob.sync(pathToData);
    let data = [];
    definitions.forEach(file => {
      const definition = require(file);
      const type = file.split('/').pop().split('.')[0];
      mutate(definition, type);
      data.push.apply(data, definition.entities);
    });
    return data;
  })();

  let self = {};
  self.all = function(done) {
    done(null, data);
  };
  self.byType = function(type, done) {
    done(null, data.filter(d => { return d.type === type; }));
  };

  self.matchByTags = function(tags, done) {
    debug('matching by tags', tags);
    const items = data.length;
    const a = new Set(tags);
    const score = rowTags => {
      const b = new Set(rowTags);
      const difference = new Set([...a].filter(x => !b.has(x)));
      const found = ((items - difference.size) / items) * 100;
      return found;
    };

    const result = data.map(m => {
      m.score = score(m.tags);
      debug(m.score);
      return m;
    }).sort((a, b) => {
      return (a.score < b.score);
    });
    done(null, result);
  };

  return Object.freeze(self);
};

