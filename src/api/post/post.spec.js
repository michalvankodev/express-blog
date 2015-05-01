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

var newPost = {
  title: 'Testing Post',
  seoTitle: 'testing-post',
  author: user._id,
  body: '<p>This is a testing post</p>',
  state: 'Published'
};

/**
 * Remove all users and create an admin
 * @param {Function} done Callback to be invoked when done.
 */
function createAdmin(done) {
  User.remove().exec().then(() => {
    // Create user
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
}

/**
 * Clear all posts
 * @param {Function} done Callback to be invoked when done.
 */
function clearAllPosts(done) {
  Post.remove().exec().then(() => {
    done();
  });
}

describe('Post API', function() {
  before(done => createAdmin(done));
  before(done => clearAllPosts(done));
  afterEach(done => clearAllPosts(done));

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

  it('should respond with a single post', done => {
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

  it('should not respond with drafts when unauthorized', done => {
    request(app)
      .get('/api/posts?state=Draft')
      .expect(401, done);
  });

  it('should show all post when authorized', done => {
    request(app)
      .get('/api/posts?state=any')
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

});

describe('Post comments API', () => {
  before(done => createAdmin(done));
  before(done => clearAllPosts(done));
  afterEach(done => clearAllPosts(done));

  /**
   * Add testing post for comments
   * @param {Function} done Callback
   * @returns {Promise} Promise with created post
   */
  function addTestingPost() {
    return new Promise(function(resolve) {
      Post.create(newPost, (err, post) => {
        if (err) { throw err.message; }
        resolve(post);
      });
    });
  }

  it('should be able to post a comment', done => {
    addTestingPost().then(post => {
      let comment = {
        body: 'Hey, Tests are awesome',
        author: {
          name: 'Tester',
          email: 'testing@awesome.com'
        },
        isReply: false
      };

      request(app)
        .post('/api/posts/' + post.seoTitle + '/comment')
        .send(comment)
        .expect('Content-Type', /json/)
        .expect(201, done);
    });
  });

  it('should return not accept a comment without email', done => {
    addTestingPost().then(post => {
      let comment = {
        body: 'Hey, Tests are awesome',
        author: {
          name: '', // left blank

          email: 'testing@awesome.com'
        },
        isReply: false
      };

      request(app)
        .post('/api/posts/' + post.seoTitle + '/comment')
        .send(comment)
        .expect('Content-Type', /json/)
        .expect(500, done);
    });
  });

  it('should return not accept a comment when commenter has no name', done => {
    addTestingPost().then(post => {
      var comment = {
        body: 'Hey, Tests are awesome',
        author: {
          name: 'Tester',
          email: '' // left blank
        },
        isReply: false
      };

      request(app)
        .post('/api/posts/' + post.seoTitle + '/comment')
        .send(comment)
        .expect('Content-Type', /json/)
        .expect(500, done);
    });
  });

  it('should be able to remove a comment', done => {
    //TODO
    done();
  });

  it('should be able to edit a comment')

});
