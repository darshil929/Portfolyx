const mongoose = require("mongoose");
const { MONGO_URI } = require("../config");

module.exports = async function connectToDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB Connection Established!");
    } catch (error) {
        console.log(error);
    }
};