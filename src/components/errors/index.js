/**
 * Error responses
 * TODO EDIT THIS FILE
 */

module.exports[404] = function pageNotFound(req, res) {
  res.status(404).json({
    message: 'Wrong route.'
  });
};
