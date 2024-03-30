const express = require('express');
const { addETFs } = require('../controllers');
const router = express.Router();

router.get('/all-etfs', addETFs);

module.exports = { ETFRoutes: router };

