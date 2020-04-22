/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */

const _ = require("lodash");
const faker = require("faker");

const Post = require("../models/Post");
const Photo = require("../models/Photo");
const User = require("../models/User");
const Tag = require("../models/Tag");

const { connect: mongoConnect, drop: dropDb } = require("../db");

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
  { coordinates: [-73.961704, 40.662942] },
  { coordinates: [-73.856077, 40.848447] },
  { coordinates: [-73.98241999999999, 40.579505] },
  { coordinates: [-73.8601152, 40.7311739] },
  { coordinates: [-73.8803827, 40.7643124] },
  { coordinates: [-73.98513559999999, 40.7676919] },
  { coordinates: [-73.9068506, 40.6199034] },
  { coordinates: [-74.00528899999999, 40.628886] },
  { coordinates: [-73.9482609, 40.6408271] },
  { coordinates: [-74.1377286, 40.6119572] },
  { coordinates: [-73.8786113, 40.8502883] },
  { coordinates: [-73.9973325, 40.61174889999999] },
  { coordinates: [-73.96926909999999, 40.7685235] },
  { coordinates: [-73.871194, 40.6730975] },
  { coordinates: [-73.9653967, 40.6064339] },
  { coordinates: [-73.97822040000001, 40.6435254] },
  { coordinates: [-73.9829239, 40.6580753] },
  { coordinates: [-73.7032601, 40.7386417] },
  { coordinates: [-73.976112, 40.786714] },
  { coordinates: [-74.0259567, 40.6353674] },
  { coordinates: [-73.96805719999999, 40.7925587] },
  { coordinates: [-73.839297, 40.78147] },
  { coordinates: [-73.9634876, 40.6940001] },
  { coordinates: [-73.95171, 40.767461] },
  { coordinates: [-74.0085357, 40.70620539999999] },
  { coordinates: [-73.9925306, 40.7309346] },
  { coordinates: [-74.00920839999999, 40.7132925] },
  { coordinates: [-73.94024739999999, 40.7623288] },
  { coordinates: [-73.991495, 40.692273] },
  { coordinates: [-73.996984, 40.72589] },
  { coordinates: [-73.8893654, 40.81376179999999] },
  { coordinates: [-73.8642349, 40.75356] },
  { coordinates: [-73.902463, 40.694924] },
  { coordinates: [-73.9246028, 40.6522396] },
  { coordinates: [-74.1459332, 40.6103714] },
  { coordinates: [-73.84856870000002, 40.8903781] },
  { coordinates: [-73.97534999999999, 40.7516269] },
  { coordinates: [-73.9998042, 40.7251256] },
  { coordinates: [-73.990494, 40.7569545] }
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
      title: `Se perdio mi perrito Tobi ${j}`,
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
    await dropDb();
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
