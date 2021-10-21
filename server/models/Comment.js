const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  replyingTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},
{ timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;