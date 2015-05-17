/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import User from '../api/user/user.model';
import logger from '../components/logger';

User.find({}).remove(function() {
  User.create({
    username: 'test',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    password: 'test'
  }, {
    username: 'admin',
    role: 'admin',
    firstName: 'Michal',
    lastName: 'Vanko',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      logger.info('finished populating users');
    }
  );
});
