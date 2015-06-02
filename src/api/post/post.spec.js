import chai from 'chai';
import _ from 'lodash';
import app from '../../app';
import request from 'supertest';
import Post from './post.model.js';
import User from '../user/user.model';
chai.should();
var expect = chai.expect;

var user = {
  username: 'fakeuser',
  email: 'test@test.com',
  password: 'password',
  role: 'admin'
};
var userToken;

var newPost = {
  title: 'Testing Post',
  seoTitle: 'testing-post',
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
    new User(user).save((err, user) => {
      if (err) { return done(err); }
      // Get auth token for user
      var credentials = {
        'username': user.username,
        'password': user.password
      };

      request(app)
        .post('/auth')
        .send(credentials)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }
          userToken = res.body.token;
          done();
      });
    });
  });
}

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
      .expect(201)
      .end(err => {
        if (err) { throw err.message; }
        resolve();
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
    addPostAsAdmin(newPost).then(function checkDatabase() {
      Post.find({}, (err, posts) => {
        if (err) { return done(err); }
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
        .expect(400, done); // Validation Error
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
      .expect(400, done);
  });

  it('should respond with a single post', done => {
    // Add post. Should be able to add
    addPostAsAdmin(newPost).then(function getPost() {
      request(app)
        .get('/api/posts/' + newPost.seoTitle)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) { return done(err); }
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
        if (err) { return done(err); }
        res.body.results.should.be.instanceof(Array);
        res.body.total.should.equal(0);
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
        if (err) { return done(err); }
        res.body.results.should.be.instanceof(Array);
        done();
      });
  });

  it('should be able to remove a post', done => {
    addPostAsAdmin(newPost).then(function removePost() {
      request(app)
        .delete('/api/posts/' + newPost.seoTitle)
        .set('authorization', 'Bearer ' + userToken)
        .expect(200, checkDatabase);

        function checkDatabase(err) {
          if (err) { return done(err); }
          Post.find({}, (err, posts) => {
            if (err) { return done(err); }
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
        body: '<p>This is a testing of edited post</p>'
      };

      request(app)
        .patch('/api/posts/' + newPost.seoTitle)
        .set('authorization', 'Bearer ' + userToken)
        .send(editedPost)
        .expect(200, checkDatabase);

      function checkDatabase(err) {
        if (err) { return done(err); }

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


  function findCommentId(comment) {
    return new Promise(function (resolve) {
      Post.findOne({ 'comments.author.name': comment.author.name })
        .exec((err, post) => {
          if (err) { throw err; }
          let commentId = post.comments.filter(c => {
            return c.author.name === comment.author.name;
          }).pop()._id;

          resolve(commentId);
      });
    });
  }

  it('should be able to post a comment', done => {
    addPostAsAdmin(newPost).then(() => {
      let comment = {
        body: 'Hey, Tests are awesome',
        author: {
          name: 'Tester',
          email: 'testing@awesome.com'
        },
        isReply: false
      };

      request(app)
        .post(`/api/posts/${newPost.seoTitle}/comment`)
        .send(comment)
        .expect('Content-Type', /json/)
        .expect(201, done);
    });
  });

  it('should return not accept a comment without email', done => {
    addPostAsAdmin(newPost).then(() => {
      let comment = {
        body: 'Hey, Tests are awesome',
        author: {
          name: '', // left blank
          email: 'testing@awesome.com'
        },
        isReply: false
      };

      request(app)
        .post(`/api/posts/${newPost.seoTitle}/comment`)
        .send(comment)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });

  it('should not accept a comment when commenter has no name', done => {
    addPostAsAdmin(newPost).then(() => {
      let comment = {
        body: 'Hey, Tests are awesome',
        author: {
          name: 'Tester',
          email: '' // left blank
        },
        isReply: false
      };

      request(app)
        .post(`/api/posts/${newPost.seoTitle}/comment`)
        .send(comment)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });

  it('should be able to remove a comment', done => {
    let comment = {
      body: 'Hey, Tests are awesome',
      author: {
        name: 'Tester',
        email: 'testing@awesome.com'
      },
      isReply: false
    };

    addPostAsAdmin(newPost).then(function addComment(post) {
      request(app)
        .post(`/api/posts/${newPost.seoTitle}/comment`)
        .send(comment)
        .expect('Content-Type', /json/)
        .expect(201, removeCommentUnauthorized);
      });

    function removeCommentUnauthorized(err) {
      if (err) { return done(err); }
      // get comment id
      findCommentId(comment).then(commentId => {
        // Try unauthorized
        request(app)
          .delete(`/api/posts/${newPost.seoTitle}/comment/${commentId}`)
          .expect(401)
          .end((err) => {
            if (err) { return done(err); }
            removeCommentAuthorized(commentId);
          });
      });
    }

    function removeCommentAuthorized(commentId) {
      request(app)
        .delete(`/api/posts/${newPost.seoTitle}/comment/${commentId}`)
        .set('authorization', 'Bearer ' + userToken)
        .expect(200, done);
    }
  });

  it('should be able to edit a comment', done => {
    let comment = {
      body: 'Hey, Tests are awesome',
      author: {
        name: 'Tester',
        email: 'testing@awesome.com'
      },
      isReply: false
    };

    let editedComment = {
      body: 'edited comment'
    };

    addPostAsAdmin(newPost).then(() => {
      request(app)
        .post(`/api/posts/${newPost.seoTitle}/comment`)
        .send(comment)
        .expect('Content-Type', /json/)
        .expect(201, editCommentUnauthorized);
    });

    function editCommentUnauthorized(err, res) {
      if (err) { return done(err); }
      findCommentId(comment).then(commentId => {
        request(app)
          .patch(`/api/posts/${newPost.seoTitle}/comment/${commentId}`)
          .send(editedComment)
          .expect(401, (err) => {
            if (err) { return done(err); }
            editCommentAuthorized(commentId);
          });
      });
    }

    function editCommentAuthorized(commentId) {
      request(app)
        .patch(`/api/posts/${newPost.seoTitle}/comment/${commentId}`)
        .set('authorization', 'Bearer ' + userToken)
        .send(editedComment)
        .expect(200, err => {
          if (err) { return done(err); }
          checkDatabase();
        });
    }

    function checkDatabase() {
      Post.find({}, (err, post) => {
        if (err) { return done(err); }
        post[0].comments[0].body.should.equal(editedComment.body);
        done();
      });
    }
  });
});

describe('Post all comments API', () => {
  before(done => createAdmin(done));
  before(done => {
    // Create Posts with comments
    Post.remove().exec()
      .then(() => {
        return addPostAsAdmin(newPost);
      }).then(() => {
        newPost.title = 'Second Post';
        newPost.seoTitle = 'second-post';
        return addPostAsAdmin(newPost);
      }).then(() => {
        let comment1 = {
          body: 'First testing comment that should be oldest',
          isReply:  false,
          date: '2013-06-01T14:43:21.692Z',
          author: {
              name: 'Tester',
              email: 'testing@awesome.com'
          }
        };

        let comment2 = {
          body: 'Second testing comment that should be in the middle',
          isReply:  false,
          date: '2014-06-01T14:43:21.692Z',
          author: {
              name: 'Tester',
              email: 'testing@awesome.com'
          }
        };

        let comment3 = {
          body: 'Third testing comment that should be newest',
          isReply:  false,
          date: '2015-06-01T14:43:21.692Z',
          author: {
              name: 'Tester',
              email: 'testing@awesome.com'
          }
        };

        let firstPostAddition = Post.findOne({seoTitle: 'testing-post'}).exec((err, post) => {
          if (err) { return done(err); }

          post.comments.push(comment1, comment2);
          return post.save();
        });

        let secondPostAddition = Post.findOne({seoTitle: 'second-post'}).exec((err, post) => {
          if (err) { return done(err); }

          post.comments.push(comment3);
          return post.save();
        });

        return Promise.all([firstPostAddition, secondPostAddition]);
      }).then(() => done());
  });

  after(done => {
    Post.remove().exec().then(() => done());
  });
  after(done => {
    User.remove().exec().then(() => done());
  })

  it('should show all latest comments', done => {
    request(app)
      .get(`/api/posts/comments`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { return done(err); }
        res.body.results.should.be.instanceof(Array);
        res.body.total.should.be.eql(3);
        res.body.results[0].seoTitle.should.be.eql('second-post'); // test if the newest comment is on top
        done();
      });
  });

  it('should accept query parameters for all latest comments', done => {
    request(app)
      .get(`/api/posts/comments?limit=1&skip=1&sort=comments.date`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { return done(err); }
        res.body.results.should.be.instanceof(Array);
        res.body.results.length.should.be.eql(1);
        res.body.total.should.be.eql(3);
        expect(res.body.results[0].comments.body).to.contain('Second'); // test if the newest comment is on top
        done();
      });
  });

  it('should not show all latest comments for drafts when unauthorized', done => {
    request(app)
      .get(`/api/posts/comments?state=Draft`)
      .expect(401, done);
  });

  it('should show all latest comments for drafts when authorized', done => {
    request(app)
      .get(`/api/posts/comments?state=Draft`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200, done);
  });
});
