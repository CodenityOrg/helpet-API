"use strict";
const faker = require("faker");
const Bale = require("bale.js");
const bale = new Bale();

function roundBetween(fr, to){
    return Math.random() * to - fr;
}

let rLatitude = [0, -18.003809, -18.0033, -18.0037829];
let rLongitude = [0, -70.25323, -70.2023, -70.25344];

let seed = bale.genSeed("posts", 10, (post) =>{
    post.description = faker.lorem.paragraph();
    post.address = faker.address.streetAddress();
    post.latitude = rLatitude[Math.floor(Math.random() * 2 ) + 1];
    post.longitude = rLongitude[Math.floor(Math.random() * 2 ) + 1];
    post.type = Math.round(Math.random() * 1);
    return post;
}, "users");

module.exports = seed;