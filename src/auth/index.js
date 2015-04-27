'use strict';

var express = require('express');
var config = require('../config/environment');
var User = require('../api/user/user.model');
var auth = require('./auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  if (!req.body.username) return res.status(404).json({ message: 'Please provide credentials.'});
  User.findOne({username: req.body.username.toLowerCase()}, function(err, user) {
    if (err) return res.status(401).json(err);
    if (!user) {
      return res.status(404).json({ message: 'User with specified username does not exist.' });
    }
    if (!user.authenticate(req.body.password)) {
      return res.status(404).json({ message: 'This password is not correct.' });
    }

    var token = auth.signToken(user._id, user.role);
    res.json({token: token, user : user.profile});

  });
});

module.exports = router;
