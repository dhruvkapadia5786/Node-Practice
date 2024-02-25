const User = require('../models/user');

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserById = async (_id) => {
  return await User.findOne({ _id });
 };

const getAllUsers = async () => {
  return await User.find();
};

module.exports = {
  createUser,
  findUserById,
  getAllUsers
};
