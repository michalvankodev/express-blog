'use strict';

var _ = require('lodash');
var Post = require('./post.model');
var QueryParser = require('../queryparser.js');

// Get list of posts
exports.index = function(req, res) {

  var defaultConditions = {
    state : 'Published'
  };

  var defaultOptions = {
    limit : 10,
    sort: 'createdDate',
  };

  var conditions = QueryParser.getConditions(req.query, defaultConditions);
  var options = QueryParser.getOptions(req.query, defaultOptions);

  // future debuggin
  //console.log(conditions, options);

  Post.find(conditions, null, options, function (err, posts) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(posts);
  });

};

/**
 * Get a single post
 *
 * We can search a post by a seoTitle as well.
 *
 */
exports.show = function(req, res) {

  var response = function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    return res.json(post);
  };

  var identifier = req.params.id;
  if (isNumeric(identifier)) {
    Post.findById(identifier, response);
  } else {
    Post.findOne({ 'seoTitle' : identifier }, response);
  }

};

// Creates a new post in the DB.
exports.create = function(req, res) {
  Post.create(req.body, function(err, post) {
    if(err) { return handleError(res, err); }
    return res.json(201, post);
  });
};

// Updates an existing post in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Post.findById(req.params.id, function (err, post) {
    if (err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    var updated = _.merge(post, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, post);
    });
  });
};

// Deletes a post from the DB.
exports.destroy = function(req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    post.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
