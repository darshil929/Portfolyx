const { ETF } = require('../models/ETF');

const findETF = async (etfId) => {
  try {
    const etf = await ETF.findById(etfId);
    if (!etf) {
      throw new Error('ETF not found');
    }
    const lastClose = etf.data[etf.data.length - 1].close;
    return lastClose;
  } catch (error) {
    console.error('Error finding ETF:', error);
    throw error;
  }
}

module.exports = findETF;