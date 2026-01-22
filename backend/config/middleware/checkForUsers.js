const prisma = require("../../prisma/client");

async function checkDBForUser(req, res, next) {
  try {
    const { email } = req.body;

    const emailTaken = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userNameTaken) {
      return res.json({
        userTaken: "username in use",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send("cannot check if user or email is taken");
  }
}

module.exports = { checkDBForUser };
