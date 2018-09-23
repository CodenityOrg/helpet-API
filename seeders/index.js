
const Post = require("../models/Post");
const Photo = require("../models/Photo");
const User = require("../models/User");

const randLats = [0, -18.003809, -18.0033, -18.0037829];
const randLngs = [0, -70.25323, -70.2023, -70.25344];

const faker = require("faker");
const mongoose = require("mongoose");

const config = require("../deploy");


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

async function createRandomPosts(user) {
    for (let j = 0; j < 10; j++) {

        const post = {
            description: faker.lorem.paragraph(),
            address: faker.address.streetAddress(),
            type: Math.round(Math.random() * 1),
            user: user.id,
            cellphone: faker.phone.phoneNumber(),
            latitude: randLats[Math.floor(Math.random() * 2 ) + 1],
            longitude: randLngs[Math.floor(Math.random() * 2 ) + 1],
            photos: []
        };

        const postInstance = await Post.create(post);
        const photos = [];
        for (let k = 0; k < 5; k++) {
            const photo = {
                name: faker.lorem.word(),
                path: faker.image.animals(),
                thumbnailPath: "http://www.fullfondos.com/animales/perrito_blanco/perrito_blanco.jpg",
                postId: postInstance.id
            }
            const photoInstance = await Photo.create(photo);
            photos.push(photoInstance.id);
        }
        postInstance.photos = photos;
        await postInstance.save();
    }
}

async function adminSeed() {
    const defaultPassword = "helpet123";
    const admins = [
        {
            firstName: "Angel",
            lastName: "Rodriguez",
            email: "angel.rodriguez@helpet.org",
            password: defaultPassword
        },
        {
            firstName: "Rodrigo",
            lastName: "Viveros",
            email: "rodrigo.viveros@helpet.org",
            password: defaultPassword
        }
    ];

    for (const admin of admins) {
        await User.create(admin);
    }
}

async function startSeed() {
    for (let i = 0; i < 5; i++) {
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





