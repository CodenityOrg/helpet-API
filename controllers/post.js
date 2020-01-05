const Post = require("../models/Post")
const Photo = require("../models/Photo");
const Tag = require("../models/Tag");
const User = require("../models/User");
const Notification = require("../models/Notification");

const _ = require("lodash");
const upload = require('../services/image-upload');
const singleUpload = upload.single('photo');

async function sendNotification(userId, message) {
    const user = await User.findById(userId);
    io.to(user.receiverId).emit('newNotification', message);
}

async function sendNotificationsSimilarPosts (post) {
    const exceptions = [
        "publicacion",
        "la",
        "el",
        "no",
        "si",
        "por",
        "favor",
        "puedes",
        "necesita",
        "necesitado",
        "ella",
        "señor",
        "tio",
        "calle",
        "tia",
        "puede",
        "quién",
        "que",
        "nada",
        "esta",
        "este",
        "esto",
        "aquello",
        "necesito",
        "cual",
        "cuales",
        ""
    ];

    const {title, description, tags} = post;

    const keys = description.split(" ");
    const matches = [
        ..._.difference(keys, exceptions),
        ...tags
    ];

    const regexConditions = matches.map(match => new RegExp(match, "i"));
    //TODO: Implement ES for searching
    const foundPosts = await Post.find({
        type: 0,
        user: { $ne: post.user }
    })
    .populate(
        {
            path: "tags",
            match: {
                value: {
                    $in: regexConditions
                }
            }
        }
    ).exec();
    const notifications = foundPosts.map(foundPost => {
        const foundPostJson = foundPost.toJSON();
        return {
            receiver: foundPostJson.user.toString(),
            post: post._id.toString(),
            sender: post.user.toString()
        };
    });

    for (const notification of notifications) {
        const notificationCreated = await Notification.create(notification);
        sendNotification(notification.receiver, {
            id: notificationCreated._id,
            message: "Nuevo post relacionado a tu busqueda!",
            postId: notification.post
        });
    }
}

const newUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        singleUpload(req, res, async (err, some) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(some);
        });
    });
}

module.exports = {

    async createPost(req, res) {
        try {
            const {body} = req;
            const { user: { _id: userId } } = req.headers;

            try {
                await newUpload(req, res);
            } catch (e) {
                //return res.status(422).send({errors: [{title: 'Image Upload Error', detail: e}] });
            }

            const {
                title,
                description,
                address,
                latitude,
                type,
                longitude } = body;
            const tags = JSON.parse(body.tags);
            const post = {
                title,
                description,
                latitude,
                address,
                type: Number(type),
                tags: [],
                longitude,
                date: new Date(),
                user: userId
            }
            let newPost = await Post.create(post);
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

            if (req && req.file) {
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
                photos.push(photo);
                newPost.photos = photos.map((photo) => photo._id.toString());
            }

            await newPost.save();
            if (newPost.type === 1) {
                await sendNotificationsSimilarPosts({
                    ...newPost.toJSON(),
                    tags
                });
            }
            res.sendStatus(200);
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
            const { type, order } = req.query;

            /* if (type && type.includes(",")) {
                type = type.split(",");
            } */

            const filter = {};

            if (type) {
                filter.type = type;
            }

            /* if (type) {
                if (Array.isArray(type)) {
                    filter.$or = [];
                    type.forEach(val => {
                        filter.$or.push({ type: Number(val) });
                    })
                } else {
                    filter.type = Number(type);
                }
            } */

            const show = {
                title: 1,
                description: 1,
                createdAt: 1,
                latitude:1,
                longitude:1,
                photos: 1,
                address: 1,
                type: 1
            }
            const total = await Post.count(filter);
            const posts =
                    await Post.find(filter, show, { skip, limit })
                    .populate("user", {firstName:1, lastName: 1, email: 1, profile: 1})
                    .populate("photos", {thumbnailPath:1, name: 1})
                    .populate("tags")
                    .limit(Number(limit))
                    .skip(Number(skip))
                    .sort({ createdAt: order })
                    .exec();
            return res.json({
                total,
                posts
            });
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
