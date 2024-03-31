const express = require('express');
const { addStocks, getAllStocks, buyStock } = require('../controllers/StockController');
const { TokenVerify } = require('../middlewares/tokenVerify');
const router = express.Router();

router.get('/all-stocks', addStocks);
router.get('/', getAllStocks);
router.post('/buy-stock', TokenVerify, buyStock);

module.exports = { StockRoutes: router };