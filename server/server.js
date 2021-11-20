const express = require('express')
const session = require("express-session")
const dotenv = require('dotenv').config()
const passport = require("passport")
const logger = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 8888
const postsRouter = require('./routers/posts')
const usersRouter = require('./routers/users')
const commentsRouter = require('./routers/comments')
const imagesRouter = require('./routers/images')
const database = require('./database/connection')
const multer = require("multer")
const path = require("path")

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
require('./passport/config')(passport)

app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/images', imagesRouter)

app.listen(PORT, () => {
  database.connectToServer((err) => {
    if (err) {
      console.error(err)
    }
  })

  console.log(`Server is listening on port ${PORT}`)
})