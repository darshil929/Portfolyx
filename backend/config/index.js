const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Portfolyx';
const JWT_SECRET = process.env.JWT_SECRET || 'default_development_secret_key';
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || '';

module.exports = { 
    MONGO_URI, 
    JWT_SECRET,
    ALPHA_VANTAGE_API_KEY
};

