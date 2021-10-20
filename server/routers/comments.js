const express = require('express')
const passport = require("passport");
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const User = require('../models/User')
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



module.exports = router;