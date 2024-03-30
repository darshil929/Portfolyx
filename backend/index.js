const express = require('express');
const setupExpressApp = require('./services/ExpressApp');
const connectToDatabase = require('./services/Database');

const app = express();
const PORT = 8000;

const startServer = async () => {
    await connectToDatabase();
    await setupExpressApp(app);

    app.listen(PORT, () => {
        console.log(`Server running at ${PORT}`);
    });
};

startServer();
