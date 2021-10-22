const express = require('express')
const passport = require("passport");
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const User = require('../models/User')
const mongoose = require('mongoose')
const router = express.Router()

router.get('/:postID', async (req, res) => {
  const post = await Post.findOne({_id: req.params.postID })
  const comments = []

  for (let commentID of post.comments) {
    const comment = await Comment.findOne({_id: commentID})
    comments.push(comment)
  }
  res.json(comments)
})

router.get('/comment/:id', async (req, res) => {
  const comment = await Comment.findOne({_id: req.params.id})
  res.json(comment)
})

router.post('/comment', async (req, res) => {
  const comment = new Comment({...req.body})

  const post = await Post.findOne({_id: req.body.post})
  const user = await User.findOne({_id: req.body.author})

  post.comments = [...post.comments, comment]
  user.comments = [...user.comments, comment]

  comment.save()
  post.save()
  user.save()
  res.json(comment)
})

router.post('/comment/reply', async (req, res) => {
  const comment = new Comment({...req.body})

  const parentComment = await Comment.findOne({_id: req.body.replyingTo})
  const post = await Post.findOne({_id: req.body.post})
  const user = await User.findOne({_id: req.body.author})

  parentComment.replies = [...parentComment.replies, comment]
  post.comments = [...post.comments, comment]
  user.comments = [...user.comments, comment]

  comment.save()
  parentComment.save()
  post.save()
  user.save()
  
  res.json(comment)
})

router.put('/comment/like/:id', async (req, res) => {
  const comment = await Comment.findOne({_id: req.params.id})
  const user = await User.findOne({_id: req.body.userID})

  if (comment.likes.includes(mongoose.Types.ObjectId(user._id))) {
    comment.likes = comment.likes.filter((userID) => String(userID) != user._id)

    if (user.likedComments.length > 0) {
      user.likedComments = user.likedComments.filter((commentID) => String(commentID) !== String(comment._id))
    }
  } else {
    console.log('user liked comment')
    comment.likes = [...comment.likes, user]
    comment.dislikes = comment.dislikes.filter((userID) => String(userID) != user._id)
    user.likedComments = [...user.likedComments, comment._id]
    user.dislikedComments = user.dislikedComments.filter((commentID) => String(commentID) != comment._id)
  }

  const updatedComment = await comment.save()
  const updatedUser = await user.save()

  res.json({
    updatedComment,
    updatedUser,
    commentLikes: updatedComment.likes.length,
    commentDislikes: updatedComment.dislikes.length,
    userLikedComments: updatedUser.likedComments.length,
    userDislikedComments: updatedUser.dislikedComments.length,
  })
})

router.put('/comment/dislike/:id', async (req, res) => {
  const comment = await Comment.findOne({_id: req.params.id})
  const user = await User.findOne({_id: req.body.userID})

  if (comment.dislikes.includes(mongoose.Types.ObjectId(user._id))) {
    comment.dislikes = comment.likes.filter((userID) => String(userID) != user._id)

    if (user.dislikedComments.length > 0) {
      user.dislikedComments = user.dislikedComments.filter((commentID) => String(commentID) !== String(comment._id))
    }
  } else {
    console.log('user disliked comment')
    comment.dislikes = [...comment.dislikes, user]
    comment.likes = comment.likes.filter((userID) => String(userID) != user._id)
    user.dislikedComments = [...user.dislikedComments, comment._id]
    user.likedComments = user.likedComments.filter((commentID) => String(commentID) != comment._id)
  }

  const updatedComment = await comment.save()
  const updatedUser = await user.save()

  res.json({
    updatedComment,
    updatedUser,
    commentLikes: updatedComment.likes.length,
    commentDislikes: updatedComment.dislikes.length,
    userLikedComments: updatedUser.likedComments.length,
    userDislikedComments: updatedUser.dislikedComments.length,
  })
})



module.exports = router;