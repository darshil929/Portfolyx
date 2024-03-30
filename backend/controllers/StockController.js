const fs = require('fs');
const csv = require('csv-parser');

const { Stock } = require('../models/Stock');

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

module.exports = {
    addStocks,
}

