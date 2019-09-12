const express = require('express');
const router = express.Router();
const userController = require("../controllers/user");
const packageJson = require("../package");

const users = require('./users');
const posts = require("./posts");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ name: "Helpet-API", version: packageJson.version, timestamp: new Date() });
});

router.post('/login',userController.login);
router.post("/login/oauth", userController.oauthLogin);
router.use('/users', users);
router.use("/posts", posts);

module.exports = router;
