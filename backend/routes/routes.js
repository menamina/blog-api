const express = require("express");
const router = express.Router();
const remote = require("../channels/channels");
const multer = require("../multer/multer");
const { signUpValidator } = require("../config/middleware/validators");
const { checkDBForUser } = require("../config/middleware/checkForUsers");
const { verifyToken, isAdmin } = require("../config/middleware/jwtmiddleware");

// global
router.get("/", remote.getPostsAndComments);
router.get("/api/multerIMG/:image", remote.sendIMGS);
router.post("/signup", signUpValidator, checkDBForUser, remote.createUser);
router.post("/login", remote.loginUser);
router.post("/logout", remote.logout);

// user
router.post("/comments", verifyToken, remote.addComment);
router.get("/api/whoAmINow", verifyToken, remote.checkMyToken);
router.post("/api/refresh", remote.checkRefreshToken);

// admin
router.post("/admin-login", remote.loginAdmin);
router.get("/dashboard", verifyToken, isAdmin, remote.getAllPosts);
router.post(
  "/new-post",
  verifyToken,
  isAdmin,
  multer.single("image"),
  remote.addPost,
);

router.get(
  "/edit-post/:postID",
  verifyToken,
  isAdmin,
  multer.single("image"),
  remote.postToEdit,
);
router.put(
  "/edit-post/:postID",
  verifyToken,
  isAdmin,
  multer.single("image"),
  remote.postEdit,
);
router.delete("/delete-post", verifyToken, isAdmin, remote.deletePost);
router.delete(
  "/dashboard/delete-comments",
  verifyToken,
  isAdmin,
  remote.deleteComments,
);

module.exports = router;
