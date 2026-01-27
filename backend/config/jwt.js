require("dotenv").config();

const jwt = require("jsonwebtoken");
const secret = process.env.JWTSECRET;
function token(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: "15m",
    },
  );
}

module.exports = { token };
