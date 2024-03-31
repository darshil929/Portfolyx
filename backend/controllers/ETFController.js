const fs = require('fs');
const csv = require('csv-parser');

const { ETF } = require('../models/ETF');

const addETFs = async (req, res, next) => {
    try {
        const data = [];
        fs.createReadStream("C:/Users/Ritesh/Downloads/XLU.csv")
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

              // find or create the ETF document
              let etf = await ETF.findOne({ name: 'XLU' });
              if (!etf) {
                etf = await ETF.create({ name: 'XLU', data: [] });
              }
              
              // appendin the data array to the existing data in the ETF document
              etf.data = [...etf.data, ...data];
              await etf.save();

              console.log('ETF data saved successfully');
              console.log('CSV file successfully processed');

              res.status(200).json({ message: 'ETF data saved successfully' });
            } catch (error) {
              console.error('Error saving ETF data:', error);
              res.status(500).json({ message: 'Internal Server Error 2 ' });
            }
          });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error 1" });
    }
}


const getAllEtfs = async (req, res, next) => {
  try {
    const etfs = await ETF.find();

    if (!etfs || etfs.length === 0) {
      return res.status(404).json({ message: "etfs data Unavailable" });
    }

    return res.status(200).json(etfs);

  } catch (error) {
    console.error('Error getting Stock data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
    addETFs,
    getAllEtfs
}

