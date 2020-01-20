const express = require("express");

const router = express.Router();
const mailController = require("../controllers/mail");

router.post("/contact", mailController.sendContactEmail);

module.exports = router;
