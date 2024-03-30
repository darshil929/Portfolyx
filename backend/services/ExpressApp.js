// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = 8000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.listen(PORT, () => {
//     console.clear();
//     console.log(`Server Up at PORT ${PORT}`);
// })
// ExpressApp.js
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require("path");
const cors = require("cors");

const { UserRoutes, StockRoutes, ETFRoutes, PortfolioRoutes } = require("../routes");

module.exports = async function setupExpressApp(app) {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cookieParser());
    
    app.use('/user', UserRoutes);
    app.use('/stock', StockRoutes);
    app.use('/etf', ETFRoutes);
    app.use('/user', PortfolioRoutes);

    return app;
};
