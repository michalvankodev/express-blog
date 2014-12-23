/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

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
      console.log('finished populating users');
    }
  );
});
