const prisma = require("../prisma/client");
const {
  generatePassword,
  validatePassword,
} = require("../config/password/passwordUtils");
const { token } = require("../config/jwt");
const path = require("node:path");

async function sendIMGS(req, res) {
  try {
    const imgPath = Number(req.params.image);
    const imgMulterPath = path.resolve("uploads", imgPath);
    return res.sendFile(imgMulterPath);
  } catch (error) {
    console.log(error.message);
  }
}

async function getAllPosts(req, res) {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        commentsOnThisPost: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!posts) {
      res.json([]);
    } else {
      res.json(posts);
    }
  } catch (error) {
    res.status(500).send(":( cannot retrieve blog posts");
  }
}

async function getPostsAndComments(req, res) {
  try {
    const posts = await prisma.posts.findMany({
      where: { published: true },
      include: {
        commentsOnThisPost: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!posts) {
      res.json([]);
    } else {
      res.json(posts);
    }
  } catch (error) {
    res.status(500).send(":( cannot retrieve blog posts");
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const saltHash = generatePassword(password);
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        saltedHash: saltHash,
      },
    });
    return res.status(201).json({
      message: "User registration successful",
    });
  } catch (error) {
    res.status(500).send("error creating user");
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const emailFound = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!emailFound) {
      return res.status(401).json({
        error: "no email found",
      });
    } else {
      const correctPassword = await validatePassword(
        password,
        emailFound.saltedHash,
      );
      if (!correctPassword) {
        return res.status(401).json({
          error: "incorrect password",
        });
      } else {
        const jwtToken = token(emailFound);
        const refreshToken = jwt.sign(
          { id: emailFound.id, email: emailFound.email, role: emailFound.role },
          process.env.JWTREFRESH,
          { expiresIn: "7d" },
        );
        res.cookie("accessToken", jwtToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        });
      }
    }
  } catch (error) {
    res.status(500).send("error logging in");
  }
}

async function addComment(req, res) {
  try {
    const uID = req.user.id;
    const { postID, comment } = req.body;
    await prisma.comments.create({
      data: {
        userID: uID,
        postID: postID,
        comment: comment,
      },
    });
    res.status(200).json({ success: "success" });
  } catch (error) {
    res.status(500).send("error commenting on this post");
  }
}

async function addPost(req, res) {
  try {
    const { title, body, published } = req.body;
    const imgFile = req.image;
    await prisma.posts.create({
      data: {
        userID: req.user.id,
        title: title,
        body: body,
        published: published,
        img: imgFile ? `/api/multerIMG/${imgFile.filename}` : null,
      },
    });
    res.status(201).json({
      message: "created post",
    });
  } catch (error) {
    res.status(500).send("error commenting on this post");
  }
}

async function editPost(req, res) {
  try {
    const { postID, title, body, published } = req.body;
    const imgFile = req.image;
    await prisma.posts.update({
      where: { id: postID, userID: req.user.id },
      data: {
        title: title,
        body: body,
        published: published,
        img: imgFile ? `/api/multerIMG/${imgFile.filename}` : null,
      },
    });
    res.status(201).json({
      message: "post edited",
    });
  } catch (error) {
    res.status(500).send("error editing post");
  }
}

async function deletePost(req, res) {
  try {
    const { postID } = req.body;
    await prisma.posts.delete({
      where: { id: postID, userID: req.user.id },
    });
    res.status(201).json({
      message: "post deleted",
    });
  } catch (error) {
    res.status(500).send("error deleting post");
  }
}

async function deleteComments(req, res) {
  try {
    const { commentID, postID } = req.body;
    await prisma.comments.delete({
      where: { id: commentID, postID: postID },
    });
    res.status(201).json({
      message: "comment deleted",
    });
  } catch (error) {
    res.status(500).send("error deleting comments");
  }
}

async function checkMyToken(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  return res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  });
}

async function checkRefreshToken(req, res) {}

async function logout(req, res) {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ success: true });
  } catch (error) {
    res.status(500).send("error logging out");
  }
}

module.exports = {
  sendIMGS,
  getAllPosts,
  getPostsAndComments,
  createUser,
  loginUser,
  logout,
  addComment,
  addPost,
  editPost,
  deletePost,
  deleteComments,
  checkMyToken,
  checkRefreshToken,
};
