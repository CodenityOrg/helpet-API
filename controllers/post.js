const Post = require("../models/Post")
const Photo = require("../models/Photo");

module.exports = {
    async create(req, res) {
        const { name, description, age, race, kind, cellphone, position } = req.body;
        const files = req.files;
        const { _id } = req.headers.user;

        const post = {
            name,
            description,
            age,
            race,
            kind,
            date,
            cellphone,
            position,
            userId: _id
        }

        try {
            // TODO: Implement upload function for any service (aws, dropbox, drive, etc)
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
    async list(req, res) {
        try {
            const { limit = 10, skip = 0 } = req.query;
            const posts = await Post.find({}, { name: 1, age: 1, race: 1, url: 1, description: 1, date: 1, cellphone: 1 }, { skip, limit });
            return res.json(posts);
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }

    }
}