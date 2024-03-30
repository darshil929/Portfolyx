const { Portfolio } = require('../models/Portfolio');
const { User } = require('../models/User');

const addNewPortfolio = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }

        const { portfolio_name, cash } = req.body;

        const existingUser = await User.findOne({ _id: user._id });

        // check if the cash input is greater than the user wallet balance
        if (cash > existingUser.wallet) {
            return res.status(400).json({ message: "Insufficient funds. Please add money to your wallet first." });
        }

        // console.log(existingUser);
        // deduct cash amount from the wallet balance

        existingUser.wallet -= cash;
        await existingUser.save();
        console.log(existingUser);

        // create new portfolio with the provided cash amount
        const newPortfolio = await Portfolio.create({
            portfolio_name,
            cash,
            userID: user._id,
            stock: [],
            etf: [],
            netWorth: cash // initial net worth equal to cash amount
        });

        existingUser.portfolios.push(newPortfolio);
        await existingUser.save();
        return res.status(201).json({ message: "Portfolio Created", newPortfolio });

    } catch (err) {
        console.error('Error adding new portfolio:', err);
        res.status(500).json({ error: 'Error adding new portfolio' });
    }
}

const getAllPortfolios = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }

        const portfolios = await Portfolio.find({ userID: user._id });
        if (portfolios.length == 0) {
            return res.status(404).json({ message: "No Portfolios found!" });
        }

        return res.status(200).json(portfolios);

    } catch (error) {

    }
}

module.exports = { 
    addNewPortfolio,
    getAllPortfolios,
};
