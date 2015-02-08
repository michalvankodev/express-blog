'use strict';

var _ = require('lodash');

/**
 * Get conditions object from query for Mongoose.Model.find()
 *
 * @param
 * @returns
 */
exports.getConditions = function(query, options) {
  var conditions = query.q || {};

  return _.defaults(conditions, options);
};

/**
 * Returns object of options for Mongoose.Model.find() from query
 *
 * @see http://mongoosejs.com/docs/api.html#query_Query-setOptions
 * @param
 * @returns
 */
exports.getOptions = function(query, options) {
  // Select options from query
  var selectedOptions = _.pick(query, ['sort', 'limit', 'skip']);

  // Return selected options from query. Set defaults
  return _.defaults(selectedOptions, options);
};
