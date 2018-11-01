
const Post = require("../models/Post");
const Photo = require("../models/Photo");
const User = require("../models/User");
const Tag = require("../models/Tag");

const faker = require("faker");
const mongoose = require("mongoose");

const config = require("../deploy");

const lengths = {
    users: 5,
    posts: 5,
    photos: 5,
    tags: 5
};

function setIteratorValues() {
    const [,,...params] = process.argv;

    if (params.length) {
        for (const param of params) {
            const [prop, val] = param.split("=");
            if (Number.isInteger(Number(val))) {
                lengths[prop] = Number(val);
            }
        }
    }
}


const {NODE_ENV} = process.env;

//TODO: Add user verification before make a seed in production database
if (NODE_ENV === "production") {
    console.log("Really? O.O");
}

async function dropDB() {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.dbURI);
        mongoose.connection.on("open", function(){
            mongoose.connection.db.dropDatabase(resolve);
        });
    })
   
}

async function createRandomUser() {
    const user = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        description: faker.lorem.paragraph(),
        email: faker.internet.email(),
        password: "123456"
    }
    
    const userInstance = await User.create(user);
    return userInstance;
}

async function createRandomTags(post) {
    const tags = [];
    for (let i = 0; i < lengths.tags; i++) {
        const tag = {
            value: faker.lorem.word(),
        }
        const tagInstance = await Tag.create(tag);
        tags.push(tagInstance._id);
    }
    post.tags = tags;
    await post.save();
}

async function createRandomPhotos(post){
    const photos = [];
    for (let k = 0; k < lengths.photos; k++) {
        const photo = {
            name: faker.lorem.word(),
            path: faker.image.animals(),
            thumbnailPath: "http://www.fullfondos.com/animales/perrito_blanco/perrito_blanco.jpg",
        }
        const photoInstance = await Photo.create(photo);
        photos.push(photoInstance._id);
    }
    post.photos = photos;
    await post.save();
}

async function createRandomPosts(user) {
    for (let j = 0; j < lengths.posts; j++) {

        const post = {
            description: faker.lorem.paragraph(),
            address: faker.address.streetAddress(),
            type: Math.round(Math.random() * 1),
            user: user.id,
            type: Math.round(Math.random()),
            cellphone: faker.phone.phoneNumber(),
            photos: []
        };

        if (post.type === 0) {
            post.latitude = -18.01209;
            post.longitude = -70.35323; 
        } else {
            post.latitude = -18.4033;
            post.longitude = -70.5023; 
        }

        const postInstance = await Post.create(post);
        await createRandomPhotos(postInstance);
        await createRandomTags(postInstance);
    }
}

async function adminSeed() {
    const commonParams = {
        password: "helpet123"
    }
    const admins = [
        {
            firstName: "Angel",
            lastName: "Rodriguez",
            email: "angel.rodriguez@helpet.org",
            ...commonParams
        },
        {
            firstName: "Rodrigo",
            lastName: "Viveros",
            email: "rodrigo.viveros@helpet.org",
            ...commonParams
        },
        {
            firstName: "Cristian",
            lastName: "Peralta",
            email: "cristian.peralta@helpet.org",
            ...commonParams
        },
        {
            firstName: "Jose",
            lastName: "Thea",
            email: "jose.thea@helpet.org",
            ...commonParams
        },
        {
            firstName: "Gladys",
            lastName: "Mamani",
            email: "gladys.mamani@helpet.org",
            ...commonParams
        }
    ];

    for (const admin of admins) {
        await User.create(admin);
    }
}

async function startSeed() {
    for (let i = 0; i < lengths.users; i++) {
        const user = await createRandomUser();
        await createRandomPosts(user);
    }
}

async function connect() {

    return new Promise((resolve, reject) => {
        mongoose.connect(config.dbURI, resolve);
    })
    
}

async function init() {

    try {
        setIteratorValues();
        await dropDB();
        await connect();
        await adminSeed();
        await startSeed();
        console.log("Seed completed! You can check your new data in the app :)")
    } catch (error) {
        console.error(error)
    }
    process.exit();
}

init();





