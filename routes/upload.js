var express = require('express')
var router = express.Router()

var multer = require('multer')
var upload = multer({dest: './uploads'})

router.post('/upload', upload.single('lib'), function(req, res, next) {
  // TO DO : save req.file
})

module.exports = router
