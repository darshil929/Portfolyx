const express = require('express');
const { addNewPortfolio } = require('../controllers');
const router = express.Router();

router.get('/all-portfolios', addNewPortfolio);
router.get('/', getAllEtfs);

module.exports = { PortfolioRoutes: router };

