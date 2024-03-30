const express = require('express');
const { userSignup, userLogin, getUserProfile , updateWalletProfile } = require('../controllers');
const { TokenVerify } = require('../middlewares/tokenVerify');
const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/dashboard', TokenVerify, getUserProfile);
router.post('/updatewallet', TokenVerify, updateWalletProfile);


module.exports = { UserRoutes: router };

