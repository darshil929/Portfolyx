const express = require('express');
const { getStockData, getEtfHoldings } = require('../controllers/marketController');
const router = express.Router();

router.get('/stock/:symbol', getStockData);
router.get('/etf/:symbol/holdings', getEtfHoldings);

module.exports = { MarketRoutes: router };