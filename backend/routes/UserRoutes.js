const express = require('express');
const { userSignup, userLogin, getUserProfile } = require('../controllers');
const { TokenVerify } = require('../middlewares/tokenVerify');
const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/dashboard', TokenVerify, getUserProfile);

module.exports = { UserRoutes: router };