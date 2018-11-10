const express = require("express");
const router = express.Router();
const multer  = require("multer");
const postController = require("../controllers/post");
const path = require("path");
const auth = require("../middleware/auth");
const upload = require('../services/image-upload');
const singleUpload = upload.single('image')

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
router.post('/image-upload', function(req, res) {
  console.log("updasdas");
  singleUpload(req, res, function(err, some) {
    if (err) {
      return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err}] });
    }

    return res.json({'imageUrl': req.file.location});
  });
})


router.use(auth.authentication);
router.post('/', uploadMulter.array("photos", 3), postController.create);
router.post('/s3', postController.createS3);
router.get("/:id", postController.getOne);

module.exports = router;