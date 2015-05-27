/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (typeof Promise === 'undefined') {
  require('babel/polyfill');
}

import express from 'express';
import mongoose from 'mongoose';
import config from './config/environment';
import logger from './components/logger';

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  logger.info(`Express server listening on ${config.port}, in ${app.get('env')} mode`);
});

// Expose app
exports = module.exports = app;
