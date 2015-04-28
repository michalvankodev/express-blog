'use strict';

import reportError from '../error-reporter';
var _ = require('lodash');
var Post = require('./post.model');
var QueryParser = require('../queryparser.js');
var isNumeric = require('isnumeric');
import auth from '../../auth/auth.service';

/**
 * Get single post by a query
 *
 * @param {string|int} query - seoTitle or id of the post
 * @returns Post.query
 */
function singlePostQuery(query) {
  var post;
  if (isNumeric(query)) {
    post = Post.findById(query);
  } else {
    post = Post.findOne({ 'seoTitle' : query });
  }
  return post;
}

// Get list of posts
exports.index = function(req, res) {

  var defaultConditions = {
    state: 'Published'
  };

  var defaultOptions = {
    limit: 10,
    sort: '-createdDate'
  };

  var conditions = QueryParser.getConditions(req.query, defaultConditions);
  var options = QueryParser.getOptions(req.query, defaultOptions);

  if (conditions.state !== 'Published') {
    auth.hasRole('admin')(req, res, returnPosts);
  }
  else {
    returnPosts();
  }

  function returnPosts(err) {
    if(err) { return res.status(401).json(err.message);}

    Post.find(conditions, null, options)
      .populate('author', '-salt -hashedPassword')
      .exec((err, posts) => {
        if(err) { return res.status(500).json(reportError(err)); }
        return res.status(200).json(posts);
    });
  }
};

/**
 * Get a single post
 *
 * We can search a post by a seoTitle as well.
 *
 */
exports.show = function(req, res) {

  var response = function (err, post) {
    if(err) { return res.status(500).json(reportError(err)); }
    if(!post) { return res.status(404); }

    return res.json(post);
  };

  singlePostQuery(req.params.id)
    .populate('author', '-salt -hashedPassword')
    .exec(response);
};

// Creates a new post in the DB.
exports.create = function(req, res) {
  // Set author of the post
  // The `isAuthenticated` function set user to the request.
  var newPost = req.body;
  newPost.author = req.user._id;
  newPost.lastUpdated = Date.now();

  Post.create(newPost, function(err, post) {
    if (err) { return res.status(500).json(reportError(err)); }
    return res.status(201).json(post);
  });
};

// Updates an existing post in the DB.
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }

  singlePostQuery(req.params.id).exec((err, post) => {
    if (err) { return res.status(500).json(reportError(err)); }
    if(!post) { return res.send(404); }

    var updated = _.merge(post, req.body);
    updated.lastUpdated = Date.now();

    updated.save((err, post) => {
      if (err) { return res.status(500).json(reportError(err)); }
      return res.status(200).json(post);
    });
  });
};

// Deletes a post from the DB.
exports.destroy = function(req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) { return res.status(500).json(reportError(err)); }
    if(!post) { return res.send(404); }
    post.remove(function(err) {
      if(err) { return res.status(500).json(reportError(err)); }
      return res.send(204);
    });
  });
};

/**
* Adds new comment to the post
*/
exports.comment = function (req, res) {
  var comment = req.body;
  comment.date = Date.now();

  singlePostQuery(req.params.id).exec((err, post) => {
    if (err) { return res.status(500).json(reportError(err)); }
    if (!post) { return res.status(404).json({ message: 'Post does not exist'}); }
    post.comments.push(comment);
    post.save((err, post) => {
      if (err) { return res.status(500).json(reportError(err)); }
      return res.status(201).json(post);
    });

  });
};

Post.on('error', function(err) {
  return err;
});
