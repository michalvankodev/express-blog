'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  seoTitle: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  createdDate: { type: Date, default: Date.now },
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
