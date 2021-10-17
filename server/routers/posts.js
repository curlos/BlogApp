const express = require('express')
const passport = require("passport");
const Post = require('../models/Post')
const User = require('../models/User')
const router = express.Router()

router.get('/', async (req, res) => {
  const posts = await Post.find({ })
  res.json(posts)
})

router.get('/post/:id', async (req, res) => {
  const post = await Post.findOne({_id: req.params.id})
  res.json(post)
})

router.post('/', async (req, res) => {
  const post = new Post({...req.body})
  const savedPost = await post.save()

  res.json(savedPost)
})

router.put('/post/:id', async (req, res) => {
  const post = await Post.findOne({_id: req.params.id})
  post.title = req.body.title
  post.headerImage = req.body.headerImage
  post.content = req.body.content
  post.comments = req.body.comments

  const updatedPost = await post.save()
  res.json(updatedPost)
})

router.delete('/post/:id', async (req, res) => {
  const deletePost = await Post.findByIdAndDelete(req.params.id)
  res.json(deletePost)
})

module.exports = router;