const express = require("express");
const router = express.Router();
const multer  = require("multer");
const postController = require("../controllers/post");
const path = require("path");
const auth = require("../middleware/auth");
const upload = require('../services/image-upload');
const singleUpload = upload.single('photo')

const storage = multer.diskStorage({
    destination(cb) {
      cb(null, path.join(__dirname,'..', '/public/uploads'))
    },
    filename(file, cb) {
      cb(null, file.originalname)
    }
});

const uploadMulter = multer({ storage });
router.get("/", postController.list);
router.get("/tags", postController.getTags);
router.use(auth.authentication);
router.post('/s3', singleUpload, postController.createS3);
router.post('/', uploadMulter.array("photos", 3), postController.create);
router.get("/:id", postController.getOne);

module.exports = router;