


//Cagr 


const { ETF } = require('../models/ETF');

const getAllEtfs = async (req, res, next) => {
    try {
        const etfs = await ETF.find();
        console.log(etfs);
        return res.status(200).json(etfs);
    } catch (error) {
        console.error('Error getting ETF data:', error);
        return res.status(500).json({ message: 'Internal Server Error 2 ' });
    }
};

module.exports = {
    getAllEtfs,
};