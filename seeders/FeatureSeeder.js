"use strict";
const faker = require("faker");
const Bale = require("bale.js");
const bale = new Bale();

module.exports = bale.genSeed("features", 10, (feature) =>{
    feature.name = faker.lorem.word();
    return feature;
}, "posts");