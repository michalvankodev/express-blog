'use strict';

var User = require('./user.model');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
import isNumeric from 'isnumeric';
import _ from 'lodash';
import generatePassword from 'password-generator';
import reportError from '../error-reporter';

var validationError = function(res, err) {
  return res.status(422).json(reportError(err));
};

User.on('error', err => err);

function singleUserQuery(query) {
  if (isNumeric(query)) {
    return User.findById(query);
  } else {
    return User.findOne({ 'username' : query });
  }
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.username = newUser.username.toLowerCase();
  newUser.password = generatePassword();
  newUser.save((err, user) => {
    if (err) { return res.status(500).json(reportError(err)); }
    return res.status(201);
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {

    var response = function (err, user) {
      if(err) { return res.status(500).json(reportError(err)); }
      if(!user) { return res.status(404); }
      return res.json(user);
    };

    singleUserQuery(req.params.id).exec(response);
};


// Updates an existing user in the DB.
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }
  singleUserQuery(req.params.id).exec((err, user) => {
    if (err) { return res.status(500).json(reportError(err)); }
    if(!user) { return res.send(404); }
    var updated = _.merge(user, req.body);
    updated.save(function (err) {
      if (err) { return res.status(500).json(reportError(err)); }
      return res.status(200).json(user);
    });
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  singleUserQuery(req.params.id).exec((err, user) => {
    if(err) { return res.status(500).json(reportError(err)); }
    if(!user) { return res.send(404); }
    user.remove((err, user) => {
      if(err) { return res.status(500).json(reportError(err)); }
      return res.send(204);
    });
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
