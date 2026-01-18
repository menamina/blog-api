const prisma = require("../prisma/client");

async function checkDBForUser(req, res, next) {
  try {
    const { username, email } = req.body;

    const userNameTaken = await prisma.user.findUnique({
      where: { username: username },
    });
    const emailTaken = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userNameTaken) {
      res.json({
        userTaken: "username in use",
      });
    } else if (emailTaken) {
      res.json({
        emailTaken: "email in use",
      });
    } else {
      res.status(201).json({
        message: "continue w registration",
      });
    }
  } catch (error) {
    res.status(500).send("cannot check if user or email is taken");
  }
}

module.exports = checkDBForUser;
