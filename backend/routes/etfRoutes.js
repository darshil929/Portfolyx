const express = require('express');
const { getAllEtfs, buyETFs, addStrategy } = require('../controllers');
const { TokenVerify } = require('../middlewares/tokenVerify');
const router = express.Router();

// router.get('/all-etfs', addETFs);
router.get('/', getAllEtfs);
router.post('/buy-etf', TokenVerify, buyETFs);
router.post('/add-strategy', TokenVerify, addStrategy);

module.exports = { ETFRoutes: router };

