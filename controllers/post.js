const Post = require("../models/Post")
const Photo = require("../models/Photo");
const notification = require("../utils/notification");
const _ = require("lodash");

module.exports = {
    async getRelatedPosts({ description, name, race, id, gender, kind }) {
        const exceptions = "la, el, no, si, por, favor, puedes, necesita, necesitado, ella, señor, tio, tia, puede, quién, que, nada, esta, este, esto, aquello, necesito, cual, cuales";
        const mExceptions = exceptions.split(", ");
        mExceptions.push("");

        const splittedDescription = description.split(" ");
        const params = _.difference(splittedDescription, mExceptions);
        const regexConditions = params.map(param => new RegExp(param, "i"));

        const foundPosts = await Post.find({}, { 
            name: new RegExp(name, "i"), 
            race, 
            gender, 
            kind, 
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
    async create(req, res) {
        const { 
            name, 
            description, 
            gender, 
            race, 
            kind,
            cellphone, 
            latitude, 
            longitude, date } = req.body;

        const { files } = req;
        const { user: {_id: userId} } = req.headers;
        const post = {
            name,
            description,
            race,
            gender,
            kind,
            loc: {
                type: "Point",
                coordinates: [0, 0]
            },
            date,
            cellphone,
            userId
        }

        if (latitude && longitude) {
            post.loc = {
                type: "Point",
                coordinates: [Number(latitude), Number(longitude)]
            }
        }

        try {
            const newPost = await Post.create(post);
            const photoPromises = [];
            files.forEach((file) => {
                photoPromises.push(Photo.create({
                    name: file.originalname,
                    path: `/uploads/${file.originalname}`,
                    postId: newPost._id.toString()
                }));
            });

            const photos = await Promise.all(photoPromises);
            newPost.photos = photos.map((photo) => photo._id.toString());
            await newPost.save();
            //this.getRelatedPosts(newPost);

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
            const { type } = req.query;
            const filter = {};

            if (type) {
                filter.type = type;
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
                    .populate("photos", {thumbnailPath:1, name: 1}).exec();
            return res.json(posts);
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }

    }
}