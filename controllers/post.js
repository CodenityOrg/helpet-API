const Post = require("../models/Post")
const Photo = require("../models/Photo");
const Feature = require("../models/Feature");
const notification = require("../utils/notification");
const _ = require("lodash");

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (const i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //New Code
    return new Blob([ab], {type: mimeString});


}

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
            description, 
            address,
            features,
            latitude, 
            longitude } = req.body;

        const { user: {_id: userId} } = req.headers;
        const post = {
            description,
            latitude,
            address,
            type,
            features: [],
            longitude,
            date: new Date(),
            user: userId
        }

        const newPost = await Post.create(post);
        for (const feature of features) {
            const data = { value: feature };
            const featureInstance = await Feature.findOrCreate(data, { value: feature, post: newPost._id });
            post.features.push(featureInstance._id);
        }
        newPost.features = post.features;
        await newPost.save();
        
        try {
            //const photoPromises = [];
           /*  photos.forEach((photo) => {
                const base64Image = photo.dataURL.split(';base64,').pop();
                fs.writeFile('/uploads/image1.png', base64Image, {encoding: 'base64'}, function(err) {
                    console.log('File created');
                });
                
                photoPromises.push(Photo.create({
                    name: file.originalname,
                    path: `/uploads/${file.originalname}`,
                    postId: newPost._id.toString()
                }));
            }); */

            /* const photos = await Promise.all(photoPromises);
            newPost.photos = photos.map((photo) => photo._id.toString());
             */
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

            if (latitude && longitude) {
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
                latitude:1,
                longitude:1,
                photos: 1,
                address: 1
            }

            const posts =
                    await Post.find(filter, show, { skip, limit })
                    .populate("features")
                    .populate("user", {firstName:1, lastName: 1, email: 1, profile: 1})
                    .populate("photos", {thumbnailPath:1, name: 1})
                    .exec();
            return res.json(posts);
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    },
    async getFeatures(req, res) {
        const features = await Feature.find({});
        return res.json(features);
    }
}