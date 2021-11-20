const { uploadFile, getFileStream } = require('../aws/s3')
const express = require('express')

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router()

router.get('/:key', async (req, res) => {
  const key = req.params.key
  const readStream = getFileStream(key)
  readStream.pipe(res)
})

router.post('/', upload.single('image'), async (req, res) => {
  const file = req.file

  const response = await uploadFile(file)

  if (file) {
    await unlinkFile(file.path)
  }


  res.send({ imagePath: `/images/${response.Key}` })
})

module.exports = router;