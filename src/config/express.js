/**
 * Express configuration
 */

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var winston = require('winston');

module.exports = function(app) {
  var env = app.get('env');

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  // TODO add logger
  //app.use(morgan('dev', {'stream': winston.log }));

  if (env === 'production') {
    // pass
  }

  if (env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
