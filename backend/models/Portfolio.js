const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    portfolio_name: { type: String, required: true },
    cash : {type : Number , required: true},
    userID  : { type: String, required: true },
    stock: [{
        stockID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'stock'
        }, 
        quantity: { type: Number, required: true },
        amount_money: { type: Number, required: true },
        investment_date : { type: Date, required: true },
    }],
    etf: [{
        etfID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'etf'
        }, 
        quantity: { type: Number, required: true },
        amount_money: { type: Number, required: true },
        investment_date : { type: Date, required: true },
    }]

});

const Portfolio = mongoose.model('portfolio', portfolioSchema);

module.exports = { Portfolio };


