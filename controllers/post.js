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
        const { name, description, gender, race, kind, cellphone, position, date } = req.body;
        const files = req.files;
        const { _id } = req.headers.user;

        const post = {
            name,
            description,
            race,
            gender,
            kind,
            date,
            cellphone,
            position,
            userId: _id
        }

        try {
            const newPost = await Post.create(post);
            const photoPromises = [];
            files.forEach((file) => {
                photoPromises.push(Photo.create({
                    name: file.originalname,
                    path: file.path,
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
            const { limit = 10, skip = 0 } = req.query;
            // Filter params
            const { kind, gender, latitude, longitude  } = req.query;
            const filter = {};

            if (kind) {
                filter.kind = kind;
            }

            if (gender) {
                filter.gender = gender;
            } 

            if (location) {
                filter.position = {
                    $near: {
                        $geometry: {
                           type: "Point" ,
                            coordinates: [latitude, longitude]
                        },
                        $maxDistance: 100,
                        $minDistance: 10
                    }
                }
            }

            const show = { 
                name: 1, 
                gender: 1,
                race: 1, 
                description: 1,
                date: 1,
                photos: 1
            }

            const posts = await Post.find(filter, show, { skip, limit }).populate("Photo").exec();
            return res.json(posts);
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }

    }
}