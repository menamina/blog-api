const prisma = require("../prisma/client");
const { generatePassword } = require("../config/password/passwordUtils");

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
    res.status(201).json({
      message: "User registration successful",
    });
  } catch (error) {
    res.status(500).send("error creating user");
  }
}

module.exports = { getPostsAndComments, createUser };
