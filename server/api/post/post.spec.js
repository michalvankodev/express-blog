'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var _ = require('lodash');
var Post = require('./post.model.js');
var User = require('../user/user.model');

var user = new User({
  username: 'fakeuser',
  email: 'test@test.com',
  password: 'password',
  role: 'admin'
});
var userToken;

describe('Post API', function() {
  before(function(done) {
    // Clear users before testing
    // Create an admin
    User.remove().exec().then(function() {
      // Create users
      user.save(function() {
        // Get auth token for user
        var credentials = {
          'username' : user.username,
          'password' : user.password
        };
        request(app)
          .post('/auth')
          .send(credentials)
          .expect(201)
          .end(function(err, res) {
            userToken = res.body.token;
            done();
        });
      });
    });
  });

  before(function(done) {
    // Clear all posts
    Post.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    // Clear all posts
    Post.remove().exec().then(function() {
      done();
    });
  });

  var newPost = {
    title: 'Testing Post',
    seoTitle: 'testing-post',
    author: user._id,
    body: '<p>This is a testing post</p>',
    state: 'Published'
  };

  it('should add new post to the database', function(done) {
    request(app)
      .post('/api/posts')
      .set('authorization', 'Bearer ' + userToken)
      .send(newPost)
      .expect('Content-Type', /json/)
      .expect(201, checkDatabase);

    function checkDatabase() {
      Post.find({}, function(err, posts) {
        posts.should.have.length(1);
        done();
      });
    }
  });

  it('should not add post with the same seoTitle to the database', function(done) {
    // Add first post. Should be able to add
    request(app)
      .post('/api/posts')
      .set('authorization', 'Bearer ' + userToken)
      .send(newPost)
      .expect('Content-Type', /json/)
      .expect(201, addSecond);

    function addSecond() {
      request(app)
        .post('/api/posts')
        .set('authorization', 'Bearer ' + userToken)
        .send(newPost) // Same post
        .expect(500, done); // Server Error
    };

  });

  it('should reject post without a title', function(done) {
    var postWithoutTitle = _.clone(newPost);
    postWithoutTitle.title = '';
    // Try to add the post
    request(app)
      .post('/api/posts')
      .set('authorization', 'Bearer ' + userToken)
      .send(postWithoutTitle)
      .expect(500, done);
  });

  it('should respond with the post', function (done) {
    // Add post. Should be able to add
    request(app)
      .post('/api/posts')
      .set('authorization', 'Bearer ' + userToken)
      .send(newPost)
      .expect('Content-Type', /json/)
      .expect(201, getPost);

    function getPost() {
      request(app)
        .get('/api/posts/' + newPost.seoTitle)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.json;
          done();
        });
    }
  });

  it('should be able to write a comment');

  it('should return an error when commenter has no email');

  it('should return an error when commenter has no name');


  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

});
