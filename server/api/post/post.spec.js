'use strict';

import * as should from 'should';
import _ from 'lodash';
import app from '../../app';
import request from 'supertest';
import Post from './post.model.js';
import User from '../user/user.model';

var user = new User({
  username: 'fakeuser',
  email: 'test@test.com',
  password: 'password',
  role: 'admin'
});
var userToken;

describe('Post API', function() {
  before(done => {
    // Clear users before testing
    // Create an admin
    User.remove().exec().then(function() {
      // Create users
      user.save(() => {
        // Get auth token for user
        var credentials = {
          'username' : user.username,
          'password' : user.password
        };
        request(app)
          .post('/auth')
          .send(credentials)
          .expect(201)
          .end((err, res) => {
            userToken = res.body.token;
            done();
        });
      });
    });
  });

  before(done => {
    // Clear all posts
    Post.remove().exec().then(() => {
      done();
    });
  });

  afterEach(done => {
    // Clear all posts
    Post.remove().exec().then(() => {
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

  it('should add new post to the database', done => {
    request(app)
      .post('/api/posts')
      .set('authorization', 'Bearer ' + userToken)
      .send(newPost)
      .expect('Content-Type', /json/)
      .expect(201, checkDatabase);

    function checkDatabase() {
      Post.find({}, (err, posts) => {
        posts.should.have.length(1);
        done();
      });
    }
  });

  it('should not add post with the same seoTitle to the database', done => {
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
    }

  });

  it('should reject post without a title', done => {
    var postWithoutTitle = _.clone(newPost);
    postWithoutTitle.title = '';
    // Try to add the post
    request(app)
      .post('/api/posts')
      .set('authorization', 'Bearer ' + userToken)
      .send(postWithoutTitle)
      .expect(500, done);
  });

  it('should respond with the post', done => {
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
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.be.json;
          done();
        });
    }
  });

  it('should be able to post a comment', done => {
    Post.create(newPost, (err, post) => {
      if (err) { throw err.message; }
      postComent(post.seoTitle);
    });

    function postComent(postSeoTitle) {
      var comment = {
        body: 'Hey, Tests are awesome',
        author: {
          name: 'Tester',
          email: 'testing@awesome.com'
        },
        isReply: false
      };

      request(app)
        .post('/api/posts/' + postSeoTitle + '/comment')
        .send(comment)
        .expect('Content-Type', /json/)
        .expect(201, done);
    }
  });

  it('should return an error when commenter has no email');

  it('should return an error when commenter has no name');


  it('should respond with JSON array', done => {
    request(app)
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

});
