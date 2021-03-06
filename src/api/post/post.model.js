import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: { type: String, required: 'Title is required' },
  seoTitle: { type: String, unique: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: 'Author is required' },
  createdDate: { type: Date, default: Date.now },
  lastUpdated: Date,
  body: String,
  comments: [{
    body: { type: String, required: 'Comment body is required' },
    author: {
      name: { type: String, required: 'Author of the comment is required. (missing name)' },
      email: { type: String, required: 'Author of the comment is required. (missing email)' }
    },
    date: Date,
    isReply: Boolean
  }],

  state: { type: String, enum: ['Draft', 'Published'], default: 'Draft'}
});

export default mongoose.model('Post', PostSchema);
