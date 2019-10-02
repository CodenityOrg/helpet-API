
const Post = require("../models/Post");
const Photo = require("../models/Photo");
const User = require("../models/User");
const Tag = require("../models/Tag");

const faker = require("faker");
const mongoose = require("mongoose");
const _ = require("lodash");

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
        password: "123456",
        phone: "+51995906010",
    }

    const userInstance = await User.create(user);
    return userInstance;
}

const choosableTags = [
    "Grande",
    "Marron",
    "Negro",
    "Con una herida",
    "Sarna",
    "Pequeño",
    "Mediano",
    "Orejas grandes",
    "Poco pelo",
    "Mucho pelo",
    "Ojos caidos",
    "Delgado",
    "Gordo",
    "Robusto"
];

const choosableAddresses = [
    "Av. Bolognesi 123",
    "Av. Leguia 321",
    "Por polvos rosados cerca a la comisaria",
    "Por la plaza perez gamboa",
    "Por el paseo civico"
];

const choosableDescriptions = [
    "Se me perdio en el pasaje que esta cerca al hospital hipolito, lleva un collar negro y es cariñoso",
    "Se escapo de la casa despues de que reventaran varios cohetes"
]

async function createRandomTags(post) {
    const tags = [];
    for (let i = 0; i < lengths.tags; i++) {
        const tag = {
            value: choosableTags[_.random(choosableTags.length - 1)],
        }
        try {
            const tagInstance = await Tag.create(tag);
            tags.push(tagInstance._id);
        } catch (e) {
            console.log(e)
        }
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
            thumbnailPath: "https://i.pinimg.com/originals/6d/6a/f1/6d6af1314dc0af9b6b22c4d6966e54c6.jpg",
        }
        const photoInstance = await Photo.create(photo);
        photos.push(photoInstance._id);
    }
    post.photos = photos;
    await post.save();
}

async function createRandomPosts(user) {
    const randomDate = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    for (let j = 0; j < lengths.posts; j++) {

        const post = {
            title: "Se perdio mi perrito Tobi",
            description: choosableDescriptions[_.random(choosableDescriptions.length - 1)],
            address: choosableAddresses[_.random(choosableAddresses.length - 1)],
            type: Math.round(_.random(1)),
            user: user.id,
            photos: []
        };

        if (post.type === 0) {
            post.latitude = -18.01209;
            post.longitude = -70.35323;
        } else {
            post.latitude = -18.4033;
            post.longitude = -70.5023;
        }
        post.createdAt = randomDate(new Date(2017, 0, 1), new Date());
        post.updatedAt = randomDate(post.createdAt, new Date());

        const postInstance = await Post.create(post);
        await createRandomPhotos(postInstance);
        await createRandomTags(postInstance);
    }
}

async function adminSeed() {
    const admins = [
        "Angel Rodriguez",
        "Rodrigo Viveros",
        "Cristian Peralta",
        "Jose Thea",
        "Franz Cruz"
    ];

    for (const admin of admins) {
        const adminData = {};
        const [firstName, lastName] = admin.split(" ");

        adminData.firstName = firstName;
        adminData.lastName = lastName;
        adminData.isAdmin = true;
        adminData.email = `${adminData.firstName.toLowerCase()}.${adminData.lastName.toLowerCase()}@helpet.org`;
        adminData.password = "helpet123";
        await User.create(adminData);
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





