const express = require('express');
const { userSignup } = require('../controllers');
const router = express.Router();

router.post('/signup', userSignup);

module.exports = { UserRoutes: router };