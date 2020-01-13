const express = require("express");

const router = express.Router();
const notificationController = require("../controllers/notification");
const auth = require("../middleware/auth");

router.use(auth.authentication);
router.get("/", notificationController.list);
router.post("/:id/read", notificationController.read);

module.exports = router;
