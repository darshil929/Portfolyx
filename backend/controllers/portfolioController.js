const { Parser } = require('json2csv');
const csv = require('csv-parser');
const { Readable } = require('stream');
const { Portfolio } = require('../models/Portfolio');
const { Stock } = require('../models/Stock');
const { ETF } = require('../models/ETF');

const exportPortfolio = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Portfolio ID is required'
            });
        }

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid portfolio ID format'
            });
        }

        console.log(`Exporting portfolio with ID: ${id}`);

        const portfolio = await Portfolio.findById(id)
            .populate('stock.stockID', 'shortName fullName')
            .populate('etf.etfID', 'name');

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: `Portfolio not found with ID: ${id}`
            });
        }

        const holdings = [];

        if (portfolio.stock && portfolio.stock.length > 0) {
            portfolio.stock.forEach(stockHolding => {
                holdings.push({
                    symbol: stockHolding.stockID?.shortName || 'Unknown',
                    name: stockHolding.stockID?.fullName || 'Unknown Stock',
                    type: 'Stock',
                    quantity: stockHolding.quantity,
                    amount_invested: stockHolding.amount_money,
                    investment_date: stockHolding.investment_date ? 
                        stockHolding.investment_date.toISOString().split('T')[0] : 'Unknown',
                    average_price: stockHolding.quantity > 0 ? 
                        (stockHolding.amount_money / stockHolding.quantity).toFixed(2) : 0
                });
            });
        }

        if (portfolio.etf && portfolio.etf.length > 0) {
            portfolio.etf.forEach(etfHolding => {
                holdings.push({
                    symbol: extractSymbolFromName(etfHolding.etfID?.name) || 'Unknown',
                    name: etfHolding.etfID?.name || 'Unknown ETF',
                    type: 'ETF',
                    quantity: etfHolding.quantity,
                    amount_invested: etfHolding.amount_money,
                    investment_date: etfHolding.investment_date ? 
                        etfHolding.investment_date.toISOString().split('T')[0] : 'Unknown',
                    average_price: etfHolding.quantity > 0 ? 
                        (etfHolding.amount_money / etfHolding.quantity).toFixed(2) : 0
                });
            });
        }

        if (holdings.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Portfolio is empty - no holdings to export'
            });
        }

        const csvFields = [
            { label: 'Symbol', value: 'symbol' },
            { label: 'Name', value: 'name' },
            { label: 'Type', value: 'type' },
            { label: 'Quantity', value: 'quantity' },
            { label: 'Amount Invested ($)', value: 'amount_invested' },
            { label: 'Average Price ($)', value: 'average_price' },
            { label: 'Investment Date', value: 'investment_date' }
        ];

        const json2csvParser = new Parser({ fields: csvFields });
        const csvData = json2csvParser.parse(holdings);

        const portfolioName = portfolio.portfolio_name || 'portfolio';
        const sanitizedFileName = portfolioName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `${sanitizedFileName}_${timestamp}.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        console.log(`Successfully exported ${holdings.length} holdings for portfolio: ${portfolio.portfolio_name}`);

        return res.status(200).send(csvData);

    } catch (error) {
        console.error(`Error exporting portfolio ${req.params.id}:`, error.message);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid portfolio ID format'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error while exporting portfolio'
        });
    }
};

const importPortfolio = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'CSV file is required'
            });
        }

        if (!req.file.buffer) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file upload - no data received'
            });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const { portfolio_name, initial_cash } = req.body;

        if (!portfolio_name || portfolio_name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Portfolio name is required'
            });
        }

        const cash = parseFloat(initial_cash) || 10000.00;

        console.log(`Importing portfolio: ${portfolio_name} for user: ${req.user._id}`);

        const csvData = [];
        const csvStream = Readable.from(req.file.buffer.toString());

        await new Promise((resolve, reject) => {
            csvStream
                .pipe(csv())
                .on('data', (row) => {
                    csvData.push(row);
                })
                .on('end', () => {
                    console.log(`Parsed ${csvData.length} rows from CSV`);
                    resolve();
                })
                .on('error', (error) => {
                    console.error('Error parsing CSV:', error);
                    reject(error);
                });
        });

        if (csvData.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'CSV file is empty or invalid format'
            });
        }

        const stockHoldings = [];
        const etfHoldings = [];
        const errors = [];

        for (let i = 0; i < csvData.length; i++) {
            const row = csvData[i];
            const symbol = row.Symbol?.trim().toUpperCase();
            const quantity = parseFloat(row.Quantity);
            const type = row.Type?.trim().toLowerCase();
            const amountInvested = parseFloat(row['Amount Invested ($)']) || 0;
            const investmentDate = row['Investment Date'] ? new Date(row['Investment Date']) : new Date();

            if (!symbol || !quantity || !type) {
                errors.push(`Row ${i + 1}: Missing required fields (Symbol, Quantity, Type)`);
                continue;
            }

            if (isNaN(quantity) || quantity <= 0) {
                errors.push(`Row ${i + 1}: Invalid quantity for ${symbol}`);
                continue;
            }

            if (type === 'stock') {
                const stock = await Stock.findOne({ shortName: symbol });
                if (!stock) {
                    errors.push(`Row ${i + 1}: Stock not found: ${symbol}`);
                    continue;
                }

                const effectiveAmount = amountInvested > 0 ? amountInvested : 
                    (stock.data.length > 0 ? quantity * stock.data[stock.data.length - 1].close : quantity * 100);

                stockHoldings.push({
                    stockID: stock._id,
                    quantity: quantity,
                    amount_money: effectiveAmount,
                    investment_date: investmentDate
                });
            } else if (type === 'etf') {
                const etf = await ETF.findOne({ 
                    $or: [
                        { name: { $regex: symbol, $options: 'i' } },
                        { name: { $regex: mapSymbolToName(symbol), $options: 'i' } }
                    ]
                });

                if (!etf) {
                    errors.push(`Row ${i + 1}: ETF not found: ${symbol}`);
                    continue;
                }

                const effectiveAmount = amountInvested > 0 ? amountInvested : 
                    (etf.data.length > 0 ? quantity * etf.data[etf.data.length - 1].close : quantity * 200);

                etfHoldings.push({
                    etfID: etf._id,
                    quantity: quantity,
                    amount_money: effectiveAmount,
                    investment_date: investmentDate
                });
            } else {
                errors.push(`Row ${i + 1}: Invalid type '${type}' for ${symbol}. Must be 'Stock' or 'ETF'`);
            }
        }

        if (stockHoldings.length === 0 && etfHoldings.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid holdings found in CSV file',
                errors: errors
            });
        }

        const totalInvested = [...stockHoldings, ...etfHoldings]
            .reduce((sum, holding) => sum + holding.amount_money, 0);

        const netWorth = cash + totalInvested;

        const newPortfolio = new Portfolio({
            portfolio_name: portfolio_name.trim(),
            cash: cash,
            userID: req.user._id,
            stock: stockHoldings,
            etf: etfHoldings,
            netWorth: netWorth
        });

        const savedPortfolio = await newPortfolio.save();

        console.log(`Successfully created portfolio: ${savedPortfolio.portfolio_name}`);
        console.log(`Imported ${stockHoldings.length} stocks and ${etfHoldings.length} ETFs`);

        return res.status(201).json({
            success: true,
            message: 'Portfolio imported successfully',
            data: {
                portfolio: savedPortfolio,
                summary: {
                    totalRowsProcessed: csvData.length,
                    stocksImported: stockHoldings.length,
                    etfsImported: etfHoldings.length,
                    totalInvested: totalInvested,
                    cash: cash,
                    netWorth: netWorth,
                    errors: errors.length > 0 ? errors : undefined
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(`Error importing portfolio:`, error.message);

        if (error.message.includes('duplicate key')) {
            return res.status(400).json({
                success: false,
                message: 'Portfolio name already exists for this user'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid portfolio data',
                details: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error while importing portfolio'
        });
    }
};

const mapSymbolToName = (symbol) => {
    const symbolMap = {
        'SPY': 'SPDR S&P 500',
        'VTI': 'Vanguard Total Stock',
        'XLK': 'Technology Select Sector',
        'QQQ': 'Invesco QQQ Trust',
        'IWM': 'iShares Russell 2000',
        'EFA': 'iShares MSCI EAFE'
    };
    
    return symbolMap[symbol] || symbol;
};

const extractSymbolFromName = (name) => {
    if (!name) return null;
    
    const upperName = name.toUpperCase();
    
    if (upperName.includes('SPDR S&P 500')) return 'SPY';
    if (upperName.includes('VANGUARD TOTAL STOCK')) return 'VTI';
    if (upperName.includes('TECHNOLOGY SELECT SECTOR')) return 'XLK';
    if (upperName.includes('SPDR')) return 'SPDR_ETF';
    if (upperName.includes('VANGUARD')) return 'VANGUARD_ETF';
    
    const words = name.split(' ');
    if (words.length > 0) {
        return words[0].toUpperCase();
    }
    
    return 'ETF';
};

module.exports = {
    exportPortfolio,
    importPortfolio
};