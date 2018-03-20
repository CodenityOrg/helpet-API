const express = require("express");
const router = express.Router();
const multer  = require("multer");
const postController = require("../controllers/post");
const path = require("path")
const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname,'..', '/tmp/uploads'))
    },
    filename(req, file, cb) {
      cb(null, file.originalname + '.jpg')
    }
})

const upload = multer({ storage })

router.post('/', upload.array("photos", 3), postController.create);

module.exports = router;