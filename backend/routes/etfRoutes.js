const express = require('express');
const { getAllEtfs } = require('../controllers');
const router = express.Router();

// router.get('/all-etfs', addETFs);
router.get('/', getAllEtfs);

module.exports = { ETFRoutes: router };

