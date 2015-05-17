/**
 * Express configuration
 */

import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import errorHandler from 'errorhandler';
import path from 'path';
import config from './environment';
import logger from '../components/logger';

export default function(app) {
  var env = app.get('env');

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  if (env === 'production') {
    app.use(morgan('combined', {'stream': logger.stream }));
  }

  if (env === 'development') {
    app.use(morgan('dev', {'stream': logger.stream }));
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(errorHandler()); // Error handler - has to be last
  }
}
