require('dotenv').config();
const userService = require('../services/userServices');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = await userService.createUser({ ...req.body, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const accessToken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '1h' });
      const refreshToken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '7d' });

      return res.json({ user, accessToken, refreshToken });
    });
  })(req, res);
};

const logoutUser = (req, res) => {
  req.logout((err) => {
    res.json({ message: 'Logout successful' });
  });
};

const userProfile = async (req, res) => {
  try {
     const id = req.params.id;
     const user = await userService.findUserById(id);
     res.json(user);
  } catch (error) {
     res.status(500).json({ error: 'Internal Server Error' });
  }
 }

 const userProfilePic = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.findUserById(id);``
    res.json(user);
    if(!user){
      console.log('something went wrong Unable to find user :>> ');
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error'})
  }
 }

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const refreshToken = async (req, res) => {
  const user = req.user;

  if (user) {
    const accessToken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '7d' });
    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  getAllUsers,
  refreshToken,
};
