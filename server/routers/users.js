const express = require('express')
const passport = require("passport");
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require("bcryptjs")
const router = express.Router()

router.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

router.get("/logout", (req, res) => {
  console.log('Logging out user')
  const user = req.user
  req.logout();
  res.json({...user})
});

router.post("/register", async (req, res, next) => {
  const newEmail = req.body.email
  const newPassword = req.body.password

  const userFound = await User.find({lowerCaseEmail: newEmail.toLowerCase().trim()})

  if (userFound.length > 0) {
    return res.json({error: 'Email taken'})
  }

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      return err
    }

    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      profilePic: 'default_user.jpeg',
      aboutMe: '',
      likes: [],
      dislikes: [],
      lowerCaseEmail: req.body.email.toLowerCase(),
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }).save((err, result) => {
      if (err) { 
        return next(err);
      }
      console.log('no err')
      res.json({'result': result})
    });
  })
});

router.post("/login", (req, res, next) => {

  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("Wrong credentials");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.json({user: req.user});
        console.log(req.user);
      });
    }
  })(req, res, next);
});

router.put("/user/update/:id", async (req, res, next) => {
  const newEmail = req.body.email
  const newPassword = req.body.password

  if (newEmail) {
    const userFound = await User.findOne({lowerCaseEmail: newEmail.toLowerCase().trim()})

    console.log(userFound)
    console.log(String(userFound._id))
    console.log(req.params.id)

    console.log(userFound.length)

    if (userFound && String(userFound._id) !== req.params.id) {
      return res.json({error: 'Email taken'})
    }
  }

  const user = await User.findOne({_id: req.params.id})
    
  user.firstName = req.body.firstName ? req.body.firstName : user.firstName
  user.lastName = req.body.lastName ? req.body.lastName : user.lastName
  user.email = req.body.email ? req.body.email : user.email
  user.lowerCaseEmail = req.body.email ? req.body.email : user.lowerCaseEmail
  user.aboutMe = req.body.aboutMe ? req.body.aboutMe : user.aboutMe
  user.profilePic = req.body.profilePic ? req.body.profilePic : user.profilePic

  if (newPassword) {
    bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
      if (err) {
        return err
      }

      console.log(newPassword)

      user.password = hashedPassword
    })
  }

  const updatedUser = await user.save()

  res.json(updatedUser)
});

router.get('/user/:id', async (req, res) => {

  const user = await User.findOne({_id: req.params.id})

  if (!user) {
    return res.send('User not found')
  }

  return res.json(user)
})

module.exports = router;