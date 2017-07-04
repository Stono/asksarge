'use strict';
const readline = require('readline');
require('colors');

const google = new require('./lib/google-language')();
const data = new require('./lib/data')();
const inspector = new require('./lib/inspector')({
  data: data,
  google: google
});

process.stdout.write('\u001b[2J\u001b[0;0H');
console.log('Hello!', 'I\'m', 'Inspector Gadget!'.bold);
console.log('I will do my best to answer your police related questions!');
console.log('I am a bit shit though, so keep your questions simple!');

let rl;
let askQuestion;
const answerQuestion = question => {
  inspector.answer(question, (err, results) => {
    console.log('Inspector Gadget'.bold, 'says:'.grey);
    const answer = results[0];
    if(answer.name) { console.log(answer.name.bold.underline); }
    process.stdout.write(answer.data);
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
