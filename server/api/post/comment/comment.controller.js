var Post = require('./post.model');

/**
* Adds new comment to the post
*/
exports.create = function (req, res, next) {
  var postId = req.params.id;
  var comment = req.body.comment;
  comment.date = Date.now();

  Post.findById(req.params.id, function(error, post){
    if(err) { return handleError(res, err); }
    post.comments.push(comment);
    post.save();
  });
};
