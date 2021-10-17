const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePic: { data: Buffer, contentType: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { data: Buffer, contentType: String},
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  commentLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  lowerCaseEmail: {type: String, lowercase: true, trim: true, required: true },
},
{ timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User;