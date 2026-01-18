const prisma = require("../prisma/client");
const {
  generatePassword,
  validatePassword,
} = require("../config/password/passwordUtils");
const jwt = require("../config/jwt");

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
        return res.status(200).json({
          message: "login successful",
        });
      }
    }
  } catch (error) {
    res.status(500).send("error logging in");
  }
}

module.exports = { getPostsAndComments, createUser, loginUser };
