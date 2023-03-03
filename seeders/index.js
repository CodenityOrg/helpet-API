/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
require("dotenv").config();

const _ = require("lodash");
const faker = require("faker");

const Post = require("../models/Post");
const Photo = require("../models/Photo");
const User = require("../models/User");
const Tag = require("../models/Tag");

const { connect: mongoConnect } = require("../db");

const lengths = {
  users: 5,
  posts: 5,
  photos: 5,
  tags: 5
};

function setIteratorValues() {
  const [, , ...params] = process.argv;
  if (params.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const param of params) {
      const [prop, val] = param.split("=");
      if (Number.isInteger(Number(val))) {
        lengths[prop] = Number(val);
      }
    }
  }
}

const { NODE_ENV } = process.env;

// TODO: Add user verification before make a seed in production database
if (NODE_ENV === "production") {
  console.log("Really? O.O");
}

async function createRandomUser() {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    description: faker.lorem.paragraph(),
    email: faker.internet.email(),
    password: "123456",
    phone: "+51995906010"
  };

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
];

const postsLocations = [
  { coordinates: [-18.033034, -70.2517722].reverse() },
  { coordinates: [-18.029004244666833, -70.26580552178878].reverse() },
  { coordinates: [-18.03926720735358, -70.26301602451899].reverse() },
  { coordinates: [-18.03765267758047, -70.26923871142208].reverse() },
  { coordinates: [-18.02944295541759, -70.27036775421085].reverse() },
  { coordinates: [-18.0249590224037, -70.24111226312516].reverse() },
  { coordinates: [-18.017081274282294, -70.25625438348072].reverse() },
  { coordinates: [-18.01261463585538, -70.23492585059485].reverse() },
  { coordinates: [-18.00785497849808, -70.23939175278755].reverse() },
  { coordinates: [-18.05325771139179, -70.24422559355557].reverse() },
  { coordinates: [-18.02920438176524, -70.2810454399207].reverse() },
  { coordinates: [-18.058546483976237, -70.24766917630913].reverse() },
  { coordinates: [-73.96926909999999, 40.7685235] },
  { coordinates: [-73.871194, 40.6730975] },
  { coordinates: [-73.9653967, 40.6064339] },
  { coordinates: [-73.97822040000001, 40.6435254] },
  { coordinates: [-73.9829239, 40.6580753] },
  { coordinates: [-73.7032601, 40.7386417] },
  { coordinates: [-73.976112, 40.786714] },
  { coordinates: [-74.0259567, 40.6353674] },
  { coordinates: [-73.96805719999999, 40.7925587] },
];

async function createRandomTags(post) {
  const tags = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lengths.tags; i++) {
    const tag = {
      value: choosableTags[_.random(choosableTags.length - 1)]
    };
    try {
      // eslint-disable-next-line no-await-in-loop
      const tagInstance = await Tag.create(tag);
      // eslint-disable-next-line no-underscore-dangle
      tags.push(tagInstance._id);
    } catch (e) {
      console.log(e);
    }
  }
  // eslint-disable-next-line no-param-reassign
  post.tags = tags;
  await post.save();
}

async function createRandomPhotos(post) {
  const photos = [];
  for (let k = 0; k < lengths.photos; k++) {
    const photo = {
      name: faker.lorem.word(),
      path: faker.image.animals(),
      thumbnailPath:
        "https://i.pinimg.com/originals/6d/6a/f1/6d6af1314dc0af9b6b22c4d6966e54c6.jpg"
    };
    // eslint-disable-next-line no-await-in-loop
    const photoInstance = await Photo.create(photo);
    // eslint-disable-next-line no-underscore-dangle
    photos.push(photoInstance._id);
  }
  post.photos = photos;
  await post.save();
}

async function createRandomPosts(user) {
  const randomDate = (start, end) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };

  for (let j = 0; j < lengths.posts; j++) {
    const post = {
      title: `Se perdio mi perrito Tobi ${_.random(1000)}`,
      description:
        choosableDescriptions[_.random(choosableDescriptions.length - 1)],
      address: choosableAddresses[_.random(choosableAddresses.length - 1)],
      type: Math.round(_.random(1)),
      user: user.id,
      photos: []
    };

    post.location = postsLocations[_.random(0, postsLocations.length - 1)];
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

  // eslint-disable-next-line no-restricted-syntax
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

async function init() {
  try {
    setIteratorValues();
    await mongoConnect();
    await adminSeed();
    await startSeed();
    console.log("Seed completed! You can check your new data in the app :)");
  } catch (error) {
    console.error(error);
  }
  process.exit();
}

init();
