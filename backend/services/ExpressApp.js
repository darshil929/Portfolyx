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
const path = require("path");

const { UserRoutes } = require("../routes");

module.exports = async function setupExpressApp(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use('/user', UserRoutes);

    return app;
};
