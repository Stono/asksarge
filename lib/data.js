'use strict';
const glob = require('glob');
const path = require('path');
const debug = require('debug')('ig:data');
const elasticsearch = require('elasticsearch');
const async = require('async');
const util = require('./util');

module.exports = function Data(config) {
  util.enforceArgs(config, ['elasticsearch']);
  let data = [];
  let self = {};
  const client = new elasticsearch.Client({
    host: `${config.elasticsearch}:9200`,
    log: 'warning'
  });

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

  self.populateElasticsearch = function(done) {
    debug('storing data in elastic search');
    const deleteIndex = next => {
      debug('deleting index');
      client.indices.delete({
        index: 'sarge'
      }, () => {
        next();
      });
    };
    const createIndex = next => {
      debug('creating index');
      client.indices.create({
        index: 'sarge'
      }, next);
    };
    const submitDocuments = done => {
      debug('bulk inserting the documents');
      const body = [];
      data.forEach(row => {
        debug(` - ${row.type}: ${row.name}`);
        body.push({ index: { _index: 'sarge', _type: row.type } });
        body.push(row);
      });
      client.bulk({
        body: body,
        refresh: 'wait_for'
      }, done);
    };
    async.series([
      deleteIndex,
      createIndex,
      submitDocuments
    ], done);
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
    /* jshint camelcase: false */
    const query = {
      dis_max: {
        tie_breaker: 2,
        queries: tags.map(t => {
          return {
            constant_score: {
              filter: {
                match: { tags: { query: t, boost: 10 } }
              },
              boost: 2
            }
          };
        })
      }
    };

    // Add the free form body search
    query.dis_max.queries.push({
      constant_score: {
        filter: {
          common: {
            name: {
              query: tags.join(' '),
              cutoff_frequency: 0.001
            }
          }
        }
      }
    });

    debug(JSON.stringify(query, null, 2));
    client.search({
      index: 'sarge',
      body: {
        query: query
      }
    }, (err, result) => {
      if(err) { return done(err); }
      debug(`${result.hits.total} results found with a maximum score of ${result.hits.max_score}`);

      const data = result.hits.hits.filter(r => {
        return r._score === result.hits.max_score;
      }).map(m => {
        const row = m._source;
        row.score = m._score;
        return row;
      });

      data.forEach(r => {
        debug(` - ${r.name}, ${r.tags}`);
      });
      done(null, data);
    });
  };

  return Object.freeze(self);
};

