const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.accessToken || req.cookies.refreshToken;
  if (req.method === "OPTIONS") {
    return next();
  }
  if (!token) {
    return res.status(401).json({ error: "you must be logged in" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWTSECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({
        error: "invalid or expired token",
      });
    }
  }
}

async function isAdmin(req, res, next) {
  const role = req.user && req.user.role;
  if (role === "admin") {
    return next();
  }

  return res.status(403).json({
    error: "you are not authorized to publish blog posts",
  });
}

module.exports = { verifyToken, isAdmin };
