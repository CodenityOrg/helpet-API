const express = require('express');
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/valid-token", userController.validToken);
router.post('/', userController.create );
router.put("/firebase-token", auth.authentication, userController.updateFirebaseToken);

module.exports = router;
