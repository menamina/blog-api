const prisma = require("../prisma/client");

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
    }
  } catch (error) {
    res.status(500).send(":( cannot retrieve blog posts");
  }
}

module.exports = { getPostsAndComments };
