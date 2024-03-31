const fs = require('fs');
const csv = require('csv-parser');

const { Stock } = require('../models/Stock');
const { Portfolio } = require('../models/Portfolio');

const addStocks = async (req, res, next) => {
  try {
    const data = [];

    fs.createReadStream('C:/Users/Admin/Downloads/AAPL.csv')
      .pipe(csv())
      .on('data', (row) => {
        // extracting data from the CSV row and push it into the array
        data.push({
          date: new Date(row.date),
          open: parseFloat(row.open),
          high: parseFloat(row.high),
          low: parseFloat(row.low),
          close: parseFloat(row.close),
          adjClose: parseFloat(row.adjClose),
          volume: parseInt(row.volume)
        });
      })
      .on('end', async () => {
        try {

          // find or create the stock document
          let stock = await Stock.findOne({ shortName: 'AAPL' });
          if (!stock) {
            stock = await Stock.create({ shortName: 'AAPL', fullName: "Apple Inc.", data: [] });
          }

          // appendin the data array to the existing data in the stock document
          stock.data = [...stock.data, ...data];
          await stock.save();

          console.log('Stock data saved successfully');
          console.log('CSV file successfully processed');

          res.status(200).json({ message: 'Stock data saved successfully' });
        } catch (error) {
          console.error('Error saving stock data:', error);
          res.status(500).json({ message: 'Internal Server Error 2 ' });
        }
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error 1" });
  }
}

const getAllStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.find();

    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ message: "Stocks data Unavailable" });
    }

    return res.status(200).json(stocks);

  } catch (error) {
    console.error('Error getting Stock data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const buyStock = async (req, res, next) => {
  try {
    const user = req.user;
    const { stockID, portfolio_name, qty, investment_date } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User Information not found" });
    }

    const toUpdatePortfolio = await Portfolio.findOne({ userID: user._id, portfolio_name });
    if (!toUpdatePortfolio) {
      return res.status(404).json({ message: "No such portfolio exists!" });
    }

    const stock = await Stock.findById(stockID);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // converting investment_date in proper Date format
    const date = new Date(investment_date);

    // calculate the amount of money for the transaction
    const amount_money = qty * stock.data[stock.data.length - 1].close;

    if (amount_money > toUpdatePortfolio.cash) {
      return res.status(400).json({ message: "Insufficient cash in portfolio" });
    }

    // deduct the amount_money from the cash of the portfolio
    toUpdatePortfolio.cash -= amount_money;

    toUpdatePortfolio.stock.push({
      stockID,
      quantity: qty,
      amount_money,
      investment_date: date
    });

    const savedResult = await toUpdatePortfolio.save();

    return res.status(200).json({ message: "Stock Purchased!", savedResult });

  } catch (error) {
    console.error('Error buying Stock:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  addStocks,
  getAllStocks,
  buyStock,
}

