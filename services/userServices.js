// services/userService.js
const userDAO = require('../data-access/userDAO');

const validateUserData = (userData) => {
  // Add validation logic here
  return userData;
};

const createUser = async (userData) => {
  const validatedData = validateUserData(userData);
  return await userDAO.createUser(validatedData);
};

const findUserById = async (_id) => {
  return await userDAO.findUserById(_id);
 };

const getAllUsers = async () => {
  return await userDAO.getAllUsers();
};

// const getUserById = async () => {
//   return await userDAO.getUserById(userId)
// }
module.exports = {
  createUser,
  findUserById,
  getAllUsers
};
