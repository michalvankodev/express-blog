'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');


var router = express.Router();
/*
Can be enabled after another oAuth module is included

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
*/
module.exports = router;
