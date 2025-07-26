const axios = require('axios');
const yahooFinance = require('yahoo-finance2').default;
const { ALPHA_VANTAGE_API_KEY } = require('../config');

const cache = new Map();

const CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const isCacheValid = (cacheEntry) => {
    if (!cacheEntry) {
        return false;
    }
    
    const currentTime = Date.now();
    const cacheTime = cacheEntry.timestamp;
    
    return (currentTime - cacheTime) < CACHE_EXPIRY_TIME;
};

const fetchStockTimeSeries = async (symbol) => {
    try {
        if (!symbol || typeof symbol !== 'string') {
            throw new Error('Invalid symbol provided');
        }

        const normalizedSymbol = symbol.toUpperCase().trim();
        const cacheKey = `stock_${normalizedSymbol}`;
        
        const cachedData = cache.get(cacheKey);
        
        if (cachedData && isCacheValid(cachedData)) {
            console.log(`Cache hit for symbol: ${normalizedSymbol}`);
            return {
                symbol: normalizedSymbol,
                data: cachedData.data,
                source: 'cache',
                timestamp: cachedData.timestamp
            };
        }

        console.log(`Cache miss for symbol: ${normalizedSymbol}`);
        
        if (!ALPHA_VANTAGE_API_KEY) {
            throw new Error('Alpha Vantage API key not configured');
        }

        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${normalizedSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        console.log(`Fetching data from Alpha Vantage for symbol: ${normalizedSymbol}`);
        
        const response = await axios.get(apiUrl, {
            timeout: 10000 // 10 second timeout
        });

        if (response.data['Error Message']) {
            throw new Error(`Alpha Vantage API Error: ${response.data['Error Message']}`);
        }

        if (response.data['Note']) {
            throw new Error(`Alpha Vantage API Rate Limit: ${response.data['Note']}`);
        }

        const metaData = response.data['Meta Data'];
        const timeSeriesData = response.data['Time Series (Daily)'];

        if (!metaData || !timeSeriesData) {
            throw new Error('Invalid response format from Alpha Vantage API');
        }

        const transformedData = {
            symbol: normalizedSymbol,
            lastRefreshed: metaData['3. Last Refreshed'],
            timeZone: metaData['5. Time Zone'],
            timeSeries: Object.entries(timeSeriesData).slice(0, 100).map(([date, values]) => ({
                date,
                open: parseFloat(values['1. open']),
                high: parseFloat(values['2. high']),
                low: parseFloat(values['3. low']),
                close: parseFloat(values['4. close']),
                adjustedClose: parseFloat(values['5. adjusted close']),
                volume: parseInt(values['6. volume']),
                dividendAmount: parseFloat(values['7. dividend amount']),
                splitCoefficient: parseFloat(values['8. split coefficient'])
            })),
            source: 'alpha_vantage',
            timestamp: Date.now()
        };

        cache.set(cacheKey, {
            data: transformedData,
            timestamp: Date.now()
        });

        console.log(`Successfully cached data for symbol: ${normalizedSymbol}`);
        
        return transformedData;

    } catch (error) {
        console.error(`Error fetching stock data for symbol ${symbol}:`, error.message);
        
        // Handle specific error types
        if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
            throw new Error('Network error: Unable to connect to Alpha Vantage API');
        }
        
        if (error.response && error.response.status === 429) {
            throw new Error('Rate limit exceeded: Too many requests to Alpha Vantage API');
        }
        
        if (error.response && error.response.status >= 500) {
            throw new Error('Alpha Vantage API server error: Please try again later');
        }
        
        if (error.message.includes('Alpha Vantage')) {
            throw error; // Re-throw Alpha Vantage specific errors as-is
        }
        
        throw new Error(`Failed to fetch stock data: ${error.message}`);
    }
};

const clearCache = () => {
    cache.clear();
    console.log('Cache cleared successfully');
};

const fetchEtfHoldings = async (symbol) => {
    try {
        if (!symbol || typeof symbol !== 'string') {
            throw new Error('Invalid ETF symbol provided');
        }

        const normalizedSymbol = symbol.toUpperCase().trim();
        const cacheKey = `etf_holdings_${normalizedSymbol}`;
        
        const cachedData = cache.get(cacheKey);
        
        if (cachedData && isCacheValid(cachedData)) {
            console.log(`Cache hit for ETF holdings: ${normalizedSymbol}`);
            return {
                symbol: normalizedSymbol,
                data: cachedData.data,
                source: 'cache',
                timestamp: cachedData.timestamp
            };
        }

        console.log(`Cache miss for ETF holdings: ${normalizedSymbol}`);
        console.log(`Fetching ETF holdings from Yahoo Finance for symbol: ${normalizedSymbol}`);
        
        const quoteSummary = await yahooFinance.quoteSummary(normalizedSymbol, {
            modules: ['fundProfile', 'topHoldings', 'fundPerformance']
        });

        if (!quoteSummary) {
            throw new Error(`No data found for ETF symbol: ${normalizedSymbol}`);
        }

        const fundProfile = quoteSummary.fundProfile;
        const topHoldings = quoteSummary.topHoldings;
        const fundPerformance = quoteSummary.fundPerformance;

        const transformedData = {
            symbol: normalizedSymbol,
            fundInfo: {
                categoryName: fundProfile?.categoryName || 'N/A',
                family: fundProfile?.family || 'N/A',
                investmentStrategy: fundProfile?.investmentStrategy || 'N/A',
                managementInfo: fundProfile?.managementInfo || {},
                feesExpensesInvestment: fundProfile?.feesExpensesInvestment || {}
            },
            holdings: {
                cashPosition: topHoldings?.cashPosition || 0,
                stockPosition: topHoldings?.stockPosition || 0,
                bondPosition: topHoldings?.bondPosition || 0,
                holdings: (topHoldings?.holdings || []).slice(0, 20).map(holding => ({
                    symbol: holding.symbol || 'N/A',
                    holdingName: holding.holdingName || 'N/A',
                    holdingPercent: holding.holdingPercent || 0
                })),
                sectorWeightings: topHoldings?.sectorWeightings || [],
                bondRatings: topHoldings?.bondRatings || []
            },
            performance: {
                performanceOverview: fundPerformance?.performanceOverview || {},
                trailingReturns: fundPerformance?.trailingReturns || {},
                annualTotalReturns: fundPerformance?.annualTotalReturns || {}
            },
            source: 'yahoo_finance',
            timestamp: Date.now()
        };

        cache.set(cacheKey, {
            data: transformedData,
            timestamp: Date.now()
        });

        console.log(`Successfully cached ETF holdings for symbol: ${normalizedSymbol}`);
        
        return transformedData;

    } catch (error) {
        console.error(`Error fetching ETF holdings for symbol ${symbol}:`, error.message);
        
        if (error.message.includes('Invalid symbol')) {
            throw error;
        }
        
        if (error.message.includes('No data found')) {
            throw new Error(`ETF symbol not found: ${symbol}`);
        }
        
        if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
            throw new Error('Network error: Unable to connect to Yahoo Finance');
        }
        
        throw new Error(`Failed to fetch ETF holdings: ${error.message}`);
    }
};

const getCacheStats = () => {
    const stats = {
        totalEntries: cache.size,
        entries: []
    };

    for (const [key, value] of cache.entries()) {
        stats.entries.push({
            key,
            timestamp: value.timestamp,
            isValid: isCacheValid(value),
            ageInMinutes: Math.floor((Date.now() - value.timestamp) / (1000 * 60))
        });
    }

    return stats;
};

module.exports = {
    fetchStockTimeSeries,
    fetchEtfHoldings,
    clearCache,
    getCacheStats
};