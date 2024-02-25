require('dotenv').config();
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/refresh-token', userController.refreshToken);
router.get('/logout', authenticationMiddleware, userController.logoutUser);
router.get('/profile/:id', authenticationMiddleware, userController.userProfile)
router.get('/', userController.getAllUsers);

module.exports = router;
