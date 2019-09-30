const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification");
const auth = require("../middleware/auth");


router.use(auth.authentication);
router.get("/:id", notificationController.list);

module.exports = router;
