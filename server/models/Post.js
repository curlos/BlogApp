const mongoose = require('mongoose')

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    headerImage: { type: String },
    content: { type: String, required: true },
    categories: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    totalComments: {type: Number, default: 0}
  },
  { timestamps: true }
  )
);

module.exports = Post;