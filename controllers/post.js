const Post = require("../models/Post")
const Photo = require("../models/Photo");
const Tag = require("../models/Tag");
const notification = require("../utils/notification");
const _ = require("lodash");
const upload = require('../services/image-upload');
const singleUpload = upload.single('photo')

module.exports = {
    async getRelatedPosts({ description, name, id, gender }) {
        const exceptions = "la, el, no, si, por, favor, puedes, necesita, necesitado, ella, señor, tio, tia, puede, quién, que, nada, esta, este, esto, aquello, necesito, cual, cuales";
        const mExceptions = exceptions.split(", ");
        mExceptions.push("");

        const splittedDescription = description.split(" ");
        const params = _.difference(splittedDescription, mExceptions);
        const regexConditions = params.map(param => new RegExp(param, "i"));

        const foundPosts = await Post.find({}, { 
            name: new RegExp(name, "i"),
            gender,
            description: { $in: regexConditions } })
            .exec();

        const usersId = foundPosts.map((post) => post.userId);
        const foundUsers = await User.find({ id: { $in: usersId } }).exec();
        const foundTokens = foundUsers.map( user => user.firebaseToken );

        notification.send(foundTokens, {
            message: "Nuevo post relacionado a tu busqueda!",
            postId: id
        });
    },
    async createS3(req, res) {
        try {
            const {body} = req;
            const { user: {_id: userId} } = req.headers;
            singleUpload(req, res, async (err, some) => {
              if (err) {
                return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err}] });
              }
              const type = 0;
              const { 
                  description, 
                  address,
                  latitude,
                  longitude } = body;
              const tags = JSON.parse(body.tags);
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
              const newPost = await Post.create(post);
              for (const tag of tags) {
                  const data = { value: tag };
                  const tagInstance = await Tag.findOrCreate(data, { value: tag, post: newPost._id });
                  post.tags.push(tagInstance._id);
              }
              newPost.tags = post.tags;
              const photos = [];

              const metadata = {
                  name: "",
                  path: ""
              }

              if (process.env.NODE_ENV === "production") {
                metadata.name = req.file.key;
                metadata.path = req.file.location;
              } else {
                metadata.name = req.file.filename;
                metadata.path = (process.env.API_HOST || "http://localhost:3000") + '/uploads/' + req.file.filename;
              }
              //TODO: Generate thumbnail for each uploaded photo 
            metadata.thumbnailPath = metadata.path;
            const photo = await Photo.create(metadata);
              photos.push(
                  photo
              );
              newPost.photos = photos.map((photo) => photo._id.toString());
              await newPost.save();
              res.sendStatus(200);
            });
        } catch (error) {
            console.log(error)
            res.sendStatus(500);
        }
    },
    async getOne(req, res) {
        const { id } = req.params;
        try {
            const post = await Post.findById(id).populate("Photo").exec();
            return res.json(post);
        } catch (error) {
            res.sendStatus(500);
        }
    },
    async list(req, res) {
        try {
            const { limit = 5, skip = 0 } = req.query;
            // Filter params
            const { type } = req.query;
            const filter = {};

            if (type) {
                filter.type = Number(type);
            }
            const show = { 
                description: 1,
                date: 1,
                latitude:1,
                longitude:1,
                photos: 1,
                address: 1
            }

            const posts =
                    await Post.find(filter, show, { skip, limit })
                    .populate("user", {firstName:1, lastName: 1, email: 1, profile: 1})
                    .populate("photos", {thumbnailPath:1, name: 1})
                    .populate("tags")
                    .limit(Number(limit))
                    .skip(Number(skip))
                    .exec();
            return res.json(posts);
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    },
    async getTags(req, res) {
        const tags = await Tag.find({});
        return res.json(tags);
    }
}