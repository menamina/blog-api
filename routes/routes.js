const express = require("express");
const router = express.Router();
const remote = require("../channels/channels");
const { signUpValidator } = require("../config/middleware/validators");
const { checkDBForUser } = require("../config/middleware/checkForUsers");

router.get("/", remote.getPostsAndComments);
router.post("/signup", signUpValidator, checkDBForUser, remote.createUser);
router.post("/login", remote.loginUser);

module.exports = router;
