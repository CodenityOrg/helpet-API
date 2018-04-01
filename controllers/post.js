const Post = require("../models/Post")
const Photo = require("../models/Photo");
const notification = require("../utils/notification");

module.exports = {
    async create(req, res) {
        const { name, description, age, gender, race, kind, cellphone, position } = req.body;
        const files = req.files;
        const { _id } = req.headers.user;

        const post = {
            name,
            description,
            age,
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
            files.forEach(async (file) => {
                const photo = {
                    name: file.originalName,
                    path: file.path,
                    postId: newPost._id
                };
                await Photo.create(photo);
            });
            res.sendStatus(200);
        } catch (error) {
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