const express = require('express')
const session = require("express-session");
const dotenv = require('dotenv').config()
const passport = require("passport");
const cors = require('cors')
const PORT = process.env.PORT || 8888
const postsRouter = require('./routers/posts')
const usersRouter = require('./routers/users')
const commentsRouter = require('./routers/comments')
const database = require('./database/connection')
const multer = require("multer")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
require('./passport/config')(passport)

app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.listen(PORT, () => {
  database.connectToServer((err) => {
    if (err) {
      console.error(err)
    }
  })

  console.log(`Server is listening on port ${PORT}`)
})