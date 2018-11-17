const express = require('express');
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

router.get("/profile", auth.authentication, userController.getProfile);
router.put("/profile", auth.authentication, userController.updateProfile);
router.post("/valid-token", userController.validToken);
router.post('/', userController.create );
router.put("/firebase-token", auth.authentication, userController.updateFirebaseToken);

module.exports = router;
