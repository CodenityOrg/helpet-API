"use strict";
const userSeeder = require("./UserSeeder");
const postSeeder = require("./PostSeeder");
const featureSeeder = require("./FeatureSeeder");

const Bale = require("bale.js");  
const config = require("../deploy/index");

const env = process.env.NODE_ENV;
const opts = {
    driver: "mongodb"
};

const { db: { host, port, name } } = config;
opts.host   = host;
opts.port   = port;
opts.dbname = name;

const bale = new Bale();

bale.connect(opts).then((seeder) => {
    seeder.use(userSeeder);
    seeder.use(postSeeder);
    seeder.use(featureSeeder);
    seeder.seed().then((msg) => {
        process.exit();
    });
})

