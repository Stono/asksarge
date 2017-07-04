'use strict';
const google = new require('./lib/google-language')();
//const data = 'tell me the email for karl stoney based at cheadle heath';
//google.getSyntax(data, console.log);

const mergeDataTags = data => {
  const tags = data.tags;
  data.entities.forEach(e => {
    e.tags.push.apply(e.tags, tags);
  });
};

const splitEntitiesIntoWords = entities => {
  const newArr = [];
  entities.forEach(e => {
    newArr.push.apply(newArr, e.split(' '));
  });
  return newArr;
};

const findBestMatch = (db, entities) => {
  const items = entities.length;
  const score = tags => {
    const b = new Set(tags);
    const a = new Set(entities);
    const difference = new Set([...a].filter(x => !b.has(x)));
    const found = ((items - difference.size) / items) * 100;
    return found;
  };
  return db.map(m => {
    m.score = score(m.tags);
    return m;
  }).sort((a, b) => {
    return (a.score < b.score);
  });
};

let numbers = require('./data/numbers');
let powers = require('./data/powers');
let definitions = require('./data/definitions');
mergeDataTags(numbers);
mergeDataTags(powers);
mergeDataTags(definitions);
let db = numbers.entities;
db.push.apply(db, powers.entities);
db.push.apply(db, definitions.entities);

const commonReplacements = question => {
  const replace = {
    define: 'definition'
  };
  Object.keys(replace).forEach(key => {
    question = question.replace(key, replace[key]);
  });
  return question;
};

const answer = function(question, done) {
  question = commonReplacements(question);
  google.getEntities(question, (err, entities) => {
    entities = splitEntitiesIntoWords(entities);
    const results = findBestMatch(db, entities);
    done(err, results);
  });
};

const readline = require('readline');
console.log('\u001b[2J\u001b[0;0H');
require('colors');
console.log('Hello!', 'I\'m', 'Inspector Gadget!'.bold);
console.log('I will do my best to answer your police related questions!');
console.log('I am a bit shit though, so keep your questions simple!');

let rl;
let askQuestion;
const answerQuestion = question => {
  answer(question, (err, results) => {
    console.log('Inspector Gadget'.bold, 'says:'.grey);
    const answer = results[0];
    if(answer.name) { console.log(answer.name.bold.underline); }
    console.log(answer.data);
    rl.close();
    askQuestion();
  });
};
askQuestion = () => {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('');
  rl.question('What can I help you with? '.bold, answerQuestion);
};

askQuestion();
