/**
 * Main application routes
 */

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/posts', require('./api/post'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);
};
