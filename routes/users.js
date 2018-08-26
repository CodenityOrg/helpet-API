var express = require('express');
var router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

/* GET users listing. */
router.get('/', function(res) {
  res.send('respond with a resource');
});

router.post('/', userController.create );
router.put("/firebase-token", auth.authentication, userController.updateFirebaseToken);

module.exports = router;
