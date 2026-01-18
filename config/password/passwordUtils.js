const bcrypt = require("bcrypt");
const salt = 15;

async function generatePassword(password) {
  const saltedHash = await bcrypt.hash(password, salt);
  return saltedHash;
}

async function validatePassword(password, saltedHash) {
  const match = await bcrypt.compare(password, saltedHash);
  return match;
}

module.exports = {
  generatePassword,
  validatePassword,
};
