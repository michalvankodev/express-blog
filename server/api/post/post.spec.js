'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/posts', function() {

  var newUser = {

  }

  var newPost = {
    title: 'Testing Post',
    seoTitle: 'testing-post',
    author: newUser,
    body: '<p>This is a testing post</p>',
    state: 'Published'
  };

  it('should add post to the database');

  it('should not add post with the same seoTitle to the database');

  it('should reject post without a title');

  it('should respond with the post');

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
