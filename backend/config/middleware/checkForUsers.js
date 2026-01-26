const prisma = require("../../prisma/client");

async function checkDBForUser(req, res, next) {
  try {
    const { email } = req.body;

    const emailTaken = await prisma.user.findUnique({
      where: { email: email },
    });

    if (emailTaken) {
      return res.status(409).json({
        userTaken: "email in use",
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("cannot check if user or email is taken");
  }
}

module.exports = { checkDBForUser };
