const express = require('express')
const passport = require("passport");
const Post = require('../models/Post')
const User = require('../models/User')
const router = express.Router()
const mongoose = require('mongoose')

router.get('/', async (req, res) => {
  const posts = await Post.find({ })
  res.json(posts)
})

router.get('/post/:id', async (req, res) => {
  console.log(req.params)
  const post = await Post.findOne({_id: req.params.id})
  res.json(post)
})

router.post('/', async (req, res) => {
  const post = new Post({...req.body})
  const user = await User.findOne({_id: req.body.author})
  console.log(req.body)
  console.log(user)
  console.log(user.posts)
  user.posts = [...user.posts, post]

  const savedPost = await post.save()
  await user.save()

  res.json(savedPost)
})

router.put('/post/:id', async (req, res) => {
  const post = await Post.findOne({_id: req.params.id})
  post.title = req.body.title
  post.headerImage = req.body.headerImage
  post.content = req.body.content
  post.categories = req.body.categories

  const updatedPost = await post.save()
  res.json(updatedPost)
})

router.put('/post/like/:id', async (req, res) => {
  const post = await Post.findOne({_id: req.params.id})
  const user = await User.findOne({_id: req.body.userID})

  if (post.likes.includes(mongoose.Types.ObjectId(user._id))) {
    post.likes = post.likes.filter((userID) => String(userID) != user._id)

    if (user.likedPosts.length > 0) {
      user.likedPosts = user.likedPosts.filter((postID) => String(postID) !== String(post._id))
    }
  } else {
    console.log(post.dislikes)
    console.log('user liked post')
    post.likes = [...post.likes, user]
    post.dislikes = post.dislikes.filter((userID) => String(userID) != user._id)
    user.likedPosts = [...user.likedPosts, post._id]
    user.dislikedPosts = user.dislikedPosts.filter((postID) => String(postID) != post._id)
  }

  const updatedPost = await post.save()
  const updatedUser = await user.save()

  res.json({
    updatedPost,
    updatedUser,
    postLikes: updatedPost.likes,
    postDislikes: updatedPost.dislikes,
    userLikedPosts: updatedUser.likedPosts,
    userDislikedPosts: updatedUser.dislikedPosts,
  })
})

router.put('/post/dislike/:id', async (req, res) => {
  const post = await Post.findOne({_id: req.params.id})
  const user = await User.findOne({_id: req.body.userID})

  if (post.dislikes.includes(mongoose.Types.ObjectId(user._id))) {
    console.log('user undisliked post')
    post.dislikes = post.dislikes.filter((userID) => String(userID) != user._id)

    if (user.dislikedPosts.length > 0) {
      user.dislikedPosts = user.dislikedPosts.filter((postID) => String(postID) !== String(post._id))
    }
  } else {
    console.log('user disliked post')
    post.dislikes = [...post.dislikes, user]
    post.likes = post.likes.filter((userID) => String(userID) != user._id)
    user.dislikedPosts = [...user.dislikedPosts, post._id]
    user.likedPosts = user.likedPosts.filter((postID) => String(postID) != String(post._id))
  }

  const updatedPost = await post.save()
  const updatedUser = await user.save()

  res.json({
    updatedPost,
    updatedUser,
    postLikes: updatedPost.likes,
    postDislikes: updatedPost.dislikes,
    userLikedPosts: updatedUser.likedPosts,
    userDislikedPosts: updatedUser.dislikedPosts,
  })
})

router.delete('/post/:id', async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id)
  const user = await User.findOne({_id: post.author})
  user.posts = user.posts.filter((postID) => String(postID) !== String(post._id))

  console.log(user.posts.length)
  await user.save()
  res.json(post)
})

module.exports = router;