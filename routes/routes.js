const express = require("express");
const router = express.Router();
const remote = require("../channels/channels");
const validators = require("../config/middleware/validators");
const { checkDBForUser } = require("../config/middleware/checkForUsers");

router.get("/", remote.getPostsAndComments);
router.post("/login");
router.post("/signup", validators, checkDBForUser, remote.createUser);

module.exports = router;
