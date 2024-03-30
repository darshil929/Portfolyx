const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const TokenVerify = async (req, res, next) => {

    const token = req.cookies.authToken;

    if(!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // attach user object to request for further processing
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports = { TokenVerify }