'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  seoTitle: String,
  author: Schema.Types.ObjectId,
  date: { type: Date, default: Date.now },
  lastUpdated: Date,
  body: String,
  comments: [{
    body: String,
    author: {
      name: String,
      email: String,
    },
    date: Date,
    isReply: Boolean
  }],

  state: { type: String, enum: ['Draft','Published'] }
});

module.exports = mongoose.model('Post', PostSchema);
