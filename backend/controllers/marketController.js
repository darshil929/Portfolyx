const { fetchStockTimeSeries, fetchEtfHoldings } = require('../services/dataService');

const getStockData = async (req, res, next) => {
    try {
        const { symbol } = req.params;

        if (!symbol) {
            return res.status(400).json({ 
                success: false,
                message: 'Stock symbol is required' 
            });
        }

        if (typeof symbol !== 'string' || symbol.trim().length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid stock symbol format' 
            });
        }

        const trimmedSymbol = symbol.trim().toUpperCase();
        
        if (trimmedSymbol.length > 10) {
            return res.status(400).json({ 
                success: false,
                message: 'Stock symbol too long (max 10 characters)' 
            });
        }

        console.log(`Fetching stock data for symbol: ${trimmedSymbol}`);

        const stockData = await fetchStockTimeSeries(trimmedSymbol);

        if (!stockData) {
            return res.status(404).json({ 
                success: false,
                message: `No data found for symbol: ${trimmedSymbol}` 
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Stock data retrieved successfully',
            data: stockData,
            requestedSymbol: trimmedSymbol,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(`Error in getStockData for symbol ${req.params.symbol}:`, error.message);

        if (error.message.includes('Invalid symbol')) {
            return res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }

        if (error.message.includes('API key not configured')) {
            return res.status(500).json({ 
                success: false,
                message: 'Market data service temporarily unavailable' 
            });
        }

        if (error.message.includes('Rate limit exceeded')) {
            return res.status(429).json({ 
                success: false,
                message: 'Too many requests. Please try again later.' 
            });
        }

        if (error.message.includes('Network error')) {
            return res.status(503).json({ 
                success: false,
                message: 'Market data service temporarily unavailable' 
            });
        }

        if (error.message.includes('Alpha Vantage API Error')) {
            return res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }

        return res.status(500).json({ 
            success: false,
            message: 'Internal server error while fetching stock data' 
        });
    }
};

const getEtfHoldings = async (req, res, next) => {
    try {
        const { symbol } = req.params;

        if (!symbol) {
            return res.status(400).json({ 
                success: false,
                message: 'ETF symbol is required' 
            });
        }

        if (typeof symbol !== 'string' || symbol.trim().length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid ETF symbol format' 
            });
        }

        const trimmedSymbol = symbol.trim().toUpperCase();
        
        if (trimmedSymbol.length > 10) {
            return res.status(400).json({ 
                success: false,
                message: 'ETF symbol too long (max 10 characters)' 
            });
        }

        console.log(`Fetching ETF holdings for symbol: ${trimmedSymbol}`);

        const etfData = await fetchEtfHoldings(trimmedSymbol);

        if (!etfData) {
            return res.status(404).json({ 
                success: false,
                message: `No holdings data found for ETF: ${trimmedSymbol}` 
            });
        }

        return res.status(200).json({
            success: true,
            message: 'ETF holdings retrieved successfully',
            data: etfData,
            requestedSymbol: trimmedSymbol,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(`Error in getEtfHoldings for symbol ${req.params.symbol}:`, error.message);

        if (error.message.includes('Invalid ETF symbol')) {
            return res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }

        if (error.message.includes('ETF symbol not found')) {
            return res.status(404).json({ 
                success: false,
                message: error.message 
            });
        }

        if (error.message.includes('Network error')) {
            return res.status(503).json({ 
                success: false,
                message: 'ETF data service temporarily unavailable' 
            });
        }

        return res.status(500).json({ 
            success: false,
            message: 'Internal server error while fetching ETF holdings' 
        });
    }
};

module.exports = {
    getStockData,
    getEtfHoldings
};