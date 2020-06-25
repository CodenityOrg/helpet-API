const express = require("express");

const router = express.Router();
// const multer  = require("multer");
const postController = require("../controllers/post");
const auth = require("../middleware/auth");
const upload = require("../services/image-upload");

const singleUpload = upload.single("photo");

router.get("/", postController.list);
router.get("/near", postController.nearList);
router.get("/tags", postController.getTags);
router.use(auth.authentication);
router.post("/s3", singleUpload, postController.createPost);
router.get("/:id", postController.getOne);

module.exports = router;
