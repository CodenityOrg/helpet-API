const Post = require("../models/Post")
module.exports = {
    async create(req, res) {
        const { description, age, race, kind, cellphone } = req.body;
        const file = req.files[0];

        const post = {
            description,
            age,
            race,
            kind,
            cellphone
        }

        try {
            // TODO: Implement upload function for any service (aws, dropbox, drive, etc)
            post.url = file.path
            await Post.create(post)
            res.sendStatus(200)
        } catch (error) {
            res.sendStatus(500)
        }
    }
}