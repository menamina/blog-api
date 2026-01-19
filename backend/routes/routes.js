const express = require("express");
const router = express.Router();
const remote = require("../channels/channels");
const { signUpValidator } = require("../config/middleware/validators");
const { checkDBForUser } = require("../config/middleware/checkForUsers");
const { verifyToken, isAdmin } = require("../config/middleware/jwtmiddleware");

// global

router.get("/blog", remote.getPostsAndComments);
router.post("/signup", signUpValidator, checkDBForUser, remote.createUser);
router.post("/login", remote.loginUser);
router.post("/logout");

// user
router.post("/comments", verifyToken, remote.addComment);

// admin
router.post("/dashboard", verifyToken, isAdmin, remote.getAllPosts);
router.post("/dashboard/addPost", verifyToken, isAdmin, remote.addPost);
router.put("/dashboard/editPost", verifyToken, isAdmin, remote.editPost);
router.delete("/dashboard/deletePost", verifyToken, isAdmin, remote.deletePost);
router.delete(
  "dashboard/deleteComments",
  verifyToken,
  isAdmin,
  remote.deleteComments,
);

module.exports = router;
