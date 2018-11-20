const express = require("express");
const router = express.Router();
const multer  = require("multer");
const postController = require("../controllers/post");
const path = require("path");
const auth = require("../middleware/auth");
const upload = require('../services/image-upload');
const singleUpload = upload.single('photo')

const Post = require("../models/Post")
const Photo = require("../models/Photo");
const Tag = require("../models/Tag");

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
  singleUpload(req, res, async (err, some) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err}] });
    }
    const type = 0;
    const { 
        description, 
        address,
        latitude,
        longitude,
        userId } = req.body;
        const tags = JSON.parse(req.body.tags);
        console.log(req.body);
        console.log("tags")
        console.log(tags)
    //const { user: {_id: userId} } = req.headers;
    const post = {
        description,
        latitude,
        address,
        type: Number(type),
        tags: [],
        longitude,
        date: new Date(),
        user: userId
    }
    console.log("req.file");
    console.log(req.file);
    const newPost = await Post.create(post);
    console.log("only tagstags")
    console.log(tags)
    for (const tag of tags) {
        const data = { value: tag };
        const tagInstance = await Tag.findOrCreate(data, { value: tag, post: newPost._id });
        post.tags.push(tagInstance._id);
    }
    newPost.tags = post.tags;
    console.log("req.file");
    console.log(req.file);
    const photos = [];
    const photo = await Photo.create({
        name: req.file.location,
        path: req.file.location,
    });
    console.log("photo")
    console.log(photo)
    photos.push(
        photo
    );
    newPost.photos = photos.map((photo) => photo._id.toString());
    await newPost.save();
    res.sendStatus(200);
    //return res.json({'imageUrl': req.file.location});
  });
})


router.use(auth.authentication);
router.post('/s3', singleUpload, postController.createS3);
router.post('/', uploadMulter.array("photos", 3), postController.create);
router.get("/:id", postController.getOne);

module.exports = router;