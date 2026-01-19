const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
      if (err) {
        return res.statue(403).json({
          error: "invalid or expired token",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      error: "you must login to comment on posts",
    });
  }
}

async function isAdmin(req, res, next) {
  const role = req.user.role;
  if (role === "admin") {
    next();
  } else {
    return res.status(403).json({
      notAdmin: "you are not authorized to publish blog posts",
    });
  }
}

module.exports = { verifyToken, isAdmin };
