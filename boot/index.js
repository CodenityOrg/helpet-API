
const Post = require("../models/Post");
const Photo = require("../models/Photo");
const User = require("../models/User");
let rLatitude = [0, -18.003809, -18.0033, -18.0037829];
let rLongitude = [0, -70.25323, -70.2023, -70.25344];

const faker = require("faker");
const mongoose = require("mongoose");

const config = require("../deploy/index");


async function dropDB() {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.dbURI);
        mongoose.connection.on("open", function(){
            mongoose.connection.db.dropDatabase(resolve);
        });
    })
   
}


async function startSeed() {
    for (let i = 0; i < 5; i++) {
        const user = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            description: faker.lorem.paragraph(),
            email: faker.internet.email(),
            password: "123456"
        }
        
        const userInstance = await User.create(user);
    
        for (let j = 0; j < 10; j++) {

            const post = {
                description: faker.lorem.paragraph(),
                address: faker.address.streetAddress(),
                type: Math.round(Math.random() * 1),
                user: userInstance.id,
                cellphone: faker.phone.phoneNumber(),
                latitude: rLatitude[Math.floor(Math.random() * 2 ) + 1],
                longitude: rLongitude[Math.floor(Math.random() * 2 ) + 1],
                photos: []
            };
    
            const postInstance = await Post.create(post);
            const photos = [];
            for (let k = 0; k < 5; k++) {
                const photo = {
                    name: faker.lorem.word(),
                    path: faker.image.imageUrl(),
                    thumbnailPath: faker.image.imageUrl(),
                    postId: postInstance.id
                }
                const photoInstance = await Photo.create(photo);
                photos.push(photoInstance.id);
            }
            postInstance.photos = photos;
            await postInstance.save();
        }
    }
}

async function connect() {

    return new Promise((resolve, reject) => {
        mongoose.connect(config.dbURI, resolve);
    })
    
}

async function init() {

    await dropDB();
    await connect();
    await startSeed();
    process.exit();
}

init();





