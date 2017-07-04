'use strict';
/* global $ */
/* global ko */
/* global io */
/* global document */
var linkify = function(data) {
  var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
  var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

  return data
  .replace(urlPattern, '<a href="$&">$&</a>')
  .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
  .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
};

ko.bindingHandlers.enterkey = {
  init: function (element, valueAccessor, allBindings, viewModel) {
    var callback = valueAccessor();
    $(element).keypress(function (event) {
      var keyCode = (event.which ? event.which : event.keyCode);
      if (keyCode === 13) {
        callback.call(viewModel);
        return false;
      }
      return true;
    });
  }
};

var go = function() {
  var lastseen = function() {
    var time = new Date();
    return 'last seen at ' + time.getHours() + ':' + (time.getMinutes()<10?'0':'') + time.getMinutes();
  };

  var formatReply = function(msg) {
    msg = msg.replace(/\n/g, '<br />');
    msg = msg.replace(/\ \ /g, '&nbsp;&nbsp;');
    msg = linkify(msg);
    return msg;
  };

  var socket = io();
  var viewModel = {
    question: ko.observable(null),
    messages: ko.observableArray([]),
    lastseen: ko.observable(lastseen())
  };
  viewModel.addReply = function(msg) {
    viewModel.messages.push({
      css: 'bubbledLeft',
      text: formatReply(msg)
    });
    $('.commentArea').scrollTop($('.commentArea')[0].scrollHeight);
    viewModel.lastseen(lastseen());
  };
  viewModel.addQuestion = function() {
    var question = this.question();
    socket.emit('question', question);
    viewModel.messages.push({
      css: 'bubbledRight',
      text: question
    });
    $('.commentArea').scrollTop($('.commentArea')[0].scrollHeight);
    this.lastseen('Sarge is typing a message...');
    this.question(null);
  };

  ko.applyBindings(viewModel, document.getElementById('chat'));

  socket.on('connect', function() {
    console.log('connected');
  })
  .on('error', function(err) {
    console.log(err);
  })
  .on('message', viewModel.addReply);
};

$(document).ready(go);
