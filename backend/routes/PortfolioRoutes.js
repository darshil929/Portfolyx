const express = require('express');
const { addNewPortfolio, getAllPortfolios } = require('../controllers');
const { TokenVerify } = require('../middlewares/tokenVerify');
const router = express.Router();

router.post('/add-portfolio', TokenVerify, addNewPortfolio);
router.get('/portfolios', TokenVerify, getAllPortfolios);
// router.get('/', getAllEtfs);

module.exports = { PortfolioRoutes: router };

