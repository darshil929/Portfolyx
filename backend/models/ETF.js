const mongoose = require('mongoose');

const etfSchema = new mongoose.Schema({
    name: { type: String, required: true },
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

const ETF = mongoose.model('etf', etfSchema);

module.exports = { ETF };

