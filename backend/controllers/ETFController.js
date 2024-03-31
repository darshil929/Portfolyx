const fs = require('fs');
const csv = require('csv-parser');

const { ETF } = require('../models/ETF');
const { Portfolio } = require('../models/Portfolio');
const findETF = require('../services/FindETF');


// const addETFs = async (req, res, next) => {
//     try {
//         const data = [];
//         fs.createReadStream("C:/Users/Ritesh/Downloads/XLU.csv")
//           .pipe(csv())
//           .on('data', (row) => {
//             // extracting data from the CSV row and push it into the array
//             data.push({
//               date: new Date(row.date),
//               open: parseFloat(row.open),
//               high: parseFloat(row.high),
//               low: parseFloat(row.low),
//               close: parseFloat(row.close),
//               adjClose: parseFloat(row.adjClose),
//               volume: parseInt(row.volume)
//             });
//           })
//           .on('end', async () => {
//             try {

//               // find or create the ETF document
//               let etf = await ETF.findOne({ name: 'XLU' });
//               if (!etf) {
//                 etf = await ETF.create({ name: 'XLU', data: [] });
//               }

//               // appendin the data array to the existing data in the ETF document
//               etf.data = [...etf.data, ...data];
//               await etf.save();

//               console.log('ETF data saved successfully');
//               console.log('CSV file successfully processed');

//               res.status(200).json({ message: 'ETF data saved successfully' });
//             } catch (error) {
//               console.error('Error saving ETF data:', error);
//               res.status(500).json({ message: 'Internal Server Error 2 ' });
//             }
//           });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal Server Error 1" });
//     }
// }


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



const buyETFs = async (req, res, next) => {
  try {
    const user = req.user;
    const { etfID, portfolio_name, qty, investment_date } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User Information not found" });
    }

    const toUpdatePortfolio = await Portfolio.findOne({ userID: user._id, portfolio_name });
    if (!toUpdatePortfolio) {
      return res.status(404).json({ message: "No such portfolio exists!" });
    }

    const etf = await ETF.findById(etfID);
    if (!etf) {
      return res.status(404).json({ message: "ETF not found" });
    }

    // converting investment_date in proper Date format
    const date = new Date(investment_date);

    // calculate the amount of money for the transaction
    const amount_money = qty * etf.data[etf.data.length - 1].close;

    if (amount_money > toUpdatePortfolio.cash) {
      return res.status(400).json({ message: "Insufficient cash in portfolio" });
    }

    // deduct the amount_money from the cash of the portfolio
    toUpdatePortfolio.cash -= amount_money;

    toUpdatePortfolio.etf.push({
      etfID,
      quantity: qty,
      amount_money,
      investment_date: date
    });

    const savedResult = await toUpdatePortfolio.save();

    return res.status(200).json({ message: "Stock Purchased!", savedResult });

  } catch (error) {
    console.error('Error buying ETF:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const addStrategy = async (req, res, next) => {
  try {
    const user = req.user;
    const { percentage, portfolio_name } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User Information not found" });
    }

    // Find the portfolio to update
    const portfolio = await Portfolio.findOne({ userID: user._id, portfolio_name });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const totalCash = (percentage / 100) * portfolio.cash;

    portfolio.cash -= totalCash;

    // const etf = await ETF.findOne({ _id:id })
    const topETFs = [
      { id: '6608501e56e86613f1a9a866', close: await findETF('6608501e56e86613f1a9a866') },
      { id: '6608ae252f1b8c1626ae178b', close: await findETF('6608ae252f1b8c1626ae178b') },
      { id: '660868490814ba52e7731291', close: await findETF('660868490814ba52e7731291') }
    ];

    const amountPerETF = totalCash / 3;
    const etfPurchases = topETFs.map(etf => {
      const quantity = Math.floor(amountPerETF / etf.close);
      return {
        etfID: etf.id,
        quantity,
        amount_money: quantity * etf.close
      };
    });

    etfPurchases.forEach(purchase => {
      portfolio.etf.push({
        etfID: purchase.etfID,
        quantity: purchase.quantity,
        amount_money: purchase.amount_money,
        investment_date: new Date() // Sst investment date to current date
      });
    });

    await portfolio.save();

    return res.status(200).json({ message: "Strategy added successfully", portfolio });

  } catch (error) {
    console.error('Error adding strategy:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


module.exports = {
  // addETFs,
  getAllEtfs,
  buyETFs,
  addStrategy
}

