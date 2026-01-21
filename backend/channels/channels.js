const prisma = require("../prisma/client");
const {
  generatePassword,
  validatePassword,
} = require("../config/password/passwordUtils");
const { token } = require("../config/jwt");

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
    const { name, username, email, password } = req.body;
    const saltHash = generatePassword(password);
    await prisma.user.create({
      data: {
        name: name,
        username: username,
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
        noEmail: "no email found",
      });
    } else {
      const correctPassword = await validatePassword(
        password,
        emailFound.saltedHash,
      );
      if (!correctPassword) {
        return res.status(401).json({
          incorrectPass: "incorrect password",
        });
      } else {
        const jwtToken = token(emailFound);
        return res.json({ token: jwtToken });
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

module.exports = {
  getAllPosts,
  getPostsAndComments,
  createUser,
  loginUser,
  addComment,
  addPost,
  editPost,
  deletePost,
  deleteComments,
};
