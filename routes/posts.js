const express = require("express");
const router = express.Router();
const multer  = require("multer");
const postController = require("../controllers/post");
const path = require("path");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname,'..', '/public/uploads'))
    },
    filename(req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage })

router.use(auth.authentication);
router.post('/', upload.array("photos", 3), postController.create);
router.get("/", postController.list);
router.get("/:id", postController.getOne);
router.get("/features", postController.getFeatures);

module.exports = router;