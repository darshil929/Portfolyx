const { Portfolio } = require('../models/Portfolio');

const addNewPortfolio = async (req, res, next) => {
    try {
        const { portfolio_name, cash } = req.body;

        const newPortfolio = await Portfolio.create({
            portfolio_name,
            cash,
            userID,
            stock : [],
            etf : []
        });
        return res.status(201).json({ message: "Portfolio Created", newPortfolio });
    } catch (err) {
        console.error('Error adding new portfolio:', err);
        res.status(500).json({ error: 'Error adding new portfolio' });
    }
}

module.exports = { addNewPortfolio };
