require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { User } = require('../models/User');
const { Portfolio } = require('../models/Portfolio');
const { Stock } = require('../models/Stock');
const { ETF } = require('../models/ETF');
const { MONGO_URI } = require('../config');

const seedDatabase = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Database connected successfully!');

        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Portfolio.deleteMany({});
        await Stock.deleteMany({});
        await ETF.deleteMany({});
        console.log('Existing data cleared!');

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('password123', saltRounds);
        const salt = await bcrypt.genSalt(saltRounds);

        console.log('Creating sample stocks...');
        const sampleStocks = await Stock.insertMany([
            {
                fullName: 'Apple Inc.',
                shortName: 'AAPL',
                data: [
                    {
                        date: new Date('2024-01-15'),
                        open: 185.50,
                        high: 188.20,
                        low: 184.10,
                        close: 187.45,
                        adjClose: 187.45,
                        volume: 45000000
                    },
                    {
                        date: new Date('2024-01-16'),
                        open: 187.45,
                        high: 190.30,
                        low: 186.80,
                        close: 189.75,
                        adjClose: 189.75,
                        volume: 42000000
                    }
                ]
            },
            {
                fullName: 'Microsoft Corporation',
                shortName: 'MSFT',
                data: [
                    {
                        date: new Date('2024-01-15'),
                        open: 385.20,
                        high: 388.90,
                        low: 383.50,
                        close: 387.30,
                        adjClose: 387.30,
                        volume: 25000000
                    },
                    {
                        date: new Date('2024-01-16'),
                        open: 387.30,
                        high: 390.15,
                        low: 385.90,
                        close: 389.45,
                        adjClose: 389.45,
                        volume: 28000000
                    }
                ]
            },
            {
                fullName: 'Tesla Inc.',
                shortName: 'TSLA',
                data: [
                    {
                        date: new Date('2024-01-15'),
                        open: 238.50,
                        high: 245.80,
                        low: 235.20,
                        close: 242.90,
                        adjClose: 242.90,
                        volume: 85000000
                    }
                ]
            }
        ]);

        console.log('Creating sample ETFs...');
        const sampleETFs = await ETF.insertMany([
            {
                name: 'SPDR S&P 500 ETF Trust',
                data: [
                    {
                        date: new Date('2024-01-15'),
                        open: 478.50,
                        high: 482.30,
                        low: 477.20,
                        close: 481.75,
                        adjClose: 481.75,
                        volume: 15000000
                    },
                    {
                        date: new Date('2024-01-16'),
                        open: 481.75,
                        high: 485.40,
                        low: 480.90,
                        close: 484.20,
                        adjClose: 484.20,
                        volume: 18000000
                    }
                ]
            },
            {
                name: 'Vanguard Total Stock Market ETF',
                data: [
                    {
                        date: new Date('2024-01-15'),
                        open: 245.80,
                        high: 248.90,
                        low: 244.50,
                        close: 247.65,
                        adjClose: 247.65,
                        volume: 8500000
                    }
                ]
            },
            {
                name: 'Technology Select Sector SPDR Fund',
                data: [
                    {
                        date: new Date('2024-01-15'),
                        open: 185.30,
                        high: 188.75,
                        low: 184.20,
                        close: 187.90,
                        adjClose: 187.90,
                        volume: 12000000
                    }
                ]
            }
        ]);

        console.log('Creating sample user...');
        const sampleUser = await User.create({
            name: 'John Doe',
            phone: '+1-555-0123',
            email: 'john.doe@example.com',
            password: hashedPassword,
            salt: salt,
            wallet: 50000.00,
            transactions: [],
            portfolios: []
        });

        console.log('Creating sample portfolios...');
        const samplePortfolios = await Portfolio.insertMany([
            {
                portfolio_name: 'Tech Growth Portfolio',
                cash: 15000.00,
                userID: sampleUser._id,
                stock: [
                    {
                        stockID: sampleStocks[0]._id, // AAPL
                        quantity: 50,
                        amount_money: 9372.50,
                        investment_date: new Date('2024-01-10')
                    },
                    {
                        stockID: sampleStocks[1]._id, // MSFT
                        quantity: 25,
                        amount_money: 9682.50,
                        investment_date: new Date('2024-01-12')
                    }
                ],
                etf: [
                    {
                        etfID: sampleETFs[2]._id, // Technology ETF
                        quantity: 100,
                        amount_money: 18790.00,
                        investment_date: new Date('2024-01-08')
                    }
                ],
                netWorth: 52845.00
            },
            {
                portfolio_name: 'Balanced Investment Portfolio',
                cash: 8500.00,
                userID: sampleUser._id,
                stock: [
                    {
                        stockID: sampleStocks[2]._id, // TSLA
                        quantity: 15,
                        amount_money: 3643.50,
                        investment_date: new Date('2024-01-14')
                    }
                ],
                etf: [
                    {
                        etfID: sampleETFs[0]._id, // SPY
                        quantity: 50,
                        amount_money: 24087.50,
                        investment_date: new Date('2024-01-05')
                    },
                    {
                        etfID: sampleETFs[1]._id, // VTI
                        quantity: 30,
                        amount_money: 7429.50,
                        investment_date: new Date('2024-01-11')
                    }
                ],
                netWorth: 43660.50
            }
        ]);

        await User.findByIdAndUpdate(sampleUser._id, {
            portfolios: samplePortfolios.map(portfolio => portfolio._id)
        });

        console.log('Sample data created successfully!');
        console.log('Created:');
        console.log(`- 1 User: ${sampleUser.name} (${sampleUser.email})`);
        console.log(`- ${sampleStocks.length} Stocks: ${sampleStocks.map(s => s.shortName).join(', ')}`);
        console.log(`- ${sampleETFs.length} ETFs: ${sampleETFs.map(e => e.name).join(', ')}`);
        console.log(`- ${samplePortfolios.length} Portfolios: ${samplePortfolios.map(p => p.portfolio_name).join(', ')}`);
        console.log('\nDefault login credentials:');
        console.log('Email: john.doe@example.com');
        console.log('Password: password123');

    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

const main = async () => {
    try {
        await seedDatabase();
        console.log('\nDatabase seeding completed successfully!');
    } catch (error) {
        console.error('Database seeding failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
};

if (require.main === module) {
    main();
}

module.exports = { seedDatabase };