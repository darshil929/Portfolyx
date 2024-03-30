const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    shortName: { type: String, required: true },
    data: [{
        date: { type: Date, required: true },
        open: { type: Number, required: true },
        high: { type: Number, required: true },
        low: { type: Number, required: true },
        close: { type: Number, required: true },
        adjClose: { type: Number, required: true },
        volume: { type: Number, required: true }
    }]
});

const Stock = mongoose.model('stock', stockSchema);

module.exports = { Stock };