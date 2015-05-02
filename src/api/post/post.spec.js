'use strict';

import chai from 'chai';
import _ from 'lodash';
import app from '../../app';
import request from 'supertest';
import Post from './post.model.js';
import User from '../user/user.model';
chai.should();
var expect = chai.expect;

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

  /**
   * Add post as an admin with Bearer token
   *
   * @param {Object} Post that should be added
   * @returns {Promise}
   */
  function addPostAsAdmin(post) {
    return new Promise(resolve => {
      request(app)
        .post('/api/posts')
        .set('authorization', 'Bearer ' + userToken)
        .send(post)
        .expect('Content-Type', /json/)
        .expect(201, resolve);
    });
  }

  it('should add new post to the database', done => {
    addPostAsAdmin(newPost).then(function checkDatabase() {
      Post.find({}, (err, posts) => {
        posts.should.have.length(1);
        done();
      });
    });
  });

  it('should not add post with the same seoTitle to the database', done => {
    // Add first post.
    addPostAsAdmin(newPost).then(function addSecond() {
      request(app)
        .post('/api/posts')
        .set('authorization', 'Bearer ' + userToken)
        .send(newPost) // Same post
        .expect(500, done); // Server Error
    });
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
    addPostAsAdmin(newPost).then(function getPost() {
      request(app)
        .get('/api/posts/' + newPost.seoTitle)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.be.json;
          done();
        });
    });
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

  it('should be able to remove a post', done => {
    addPostAsAdmin(newPost).then(function removePost() {
      request(app)
        .delete('/api/posts/' + newPost.seoTitle)
        .set('authorization', 'Bearer ' + userToken)
        .expect(204, checkDatabase);

        function checkDatabase() {
          Post.find({}, (err, posts) => {
            posts.should.have.length(0);
            done();
          });
        }
    });
  });

  it('should be able to edit a post', done => {
    addPostAsAdmin(newPost).then(function editPost() {
      let editedPost = {
        title: 'Testing edited Post',
        seoTitle: 'testing-edited-post',
        author: user._id,
        body: '<p>This is a testing of edited post</p>'
      };

      request(app)
        .patch('/api/posts/' + newPost.seoTitle)
        .set('authorization', 'Bearer ' + userToken)
        .send(editedPost)
        .expect(200, checkDatabase);

      function checkDatabase() {
        Post.findOne({seoTitle: editedPost.seoTitle}, (err, post) => {
          if (err) { return done(err); }

          expect(post).to.exist;
          post.title.should.be.equal(editedPost.title);
          post.seoTitle.should.be.equal(editedPost.seoTitle);
          post.body.should.be.equal(editedPost.body);
          post.state.should.be.equal(newPost.state, 'should contain unchanged properties');
          done();
        });
      }
    });
  });

  it('should not be able to remove post when not authorized', done => {
    addPostAsAdmin(newPost).then(function removePost() {
      request(app)
        .delete('/api/posts/' + newPost.seoTitle)
        .expect(401, done);
    });
  });

  it('should not be able to edit post when not authorized', done => {
    addPostAsAdmin(newPost).then(function removePost() {
      request(app)
        .patch('/api/posts/' + newPost.seoTitle)
        .expect(401, done);
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

  it('should be able to edit a comment');

});
