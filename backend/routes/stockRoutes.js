const express = require('express');
const { addStocks } = require('../controllers/StockController');
const router = express.Router();

router.get('/all-stocks', addStocks);

module.exports = { StockRoutes: router };