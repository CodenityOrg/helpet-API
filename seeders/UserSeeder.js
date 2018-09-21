"use strict";
const faker = require("faker");
const Bale = require("bale.js");
const bale = new Bale();

module.exports = bale.genSeed("users", 10, (user) =>{
    user.name = faker.name.firstName();
    user.lastname = faker.name.lastName();
    user.description = faker.lorem.paragraph();
    user.email = faker.internet.email();
    user.password = "1234567"; 
    return user;
});