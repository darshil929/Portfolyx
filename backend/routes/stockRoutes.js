const express = require('express');
const { addStocks, getAllStocks } = require('../controllers/StockController');
const router = express.Router();

router.get('/all-stocks', addStocks);
router.get('/', getAllStocks);

module.exports = { StockRoutes: router };