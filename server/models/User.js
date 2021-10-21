const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePic: { type: String },
  aboutMe: {type: String},
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { data: Buffer, contentType: String},
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  dislikedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  dislikedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  lowerCaseEmail: {type: String, lowercase: true, trim: true, required: true },
},
{ timestamps: true })

// userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)

module.exports = User;