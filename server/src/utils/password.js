const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/configuration");

const hashPassword = async (password) => {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return hashed;
};

const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

module.exports = {
  hashPassword,
  comparePassword,
};
