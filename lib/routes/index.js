'use strict';
module.exports = function Index(app, controller) {
  app.get('/', controller.read);
};
