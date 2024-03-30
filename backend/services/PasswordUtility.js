const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

async function GenerateSalt(){
    const saltRounds = 10;
    return await bcrypt.genSalt(saltRounds);
}

const EncryptedPassword = async (password, salt) => {
    return await bcrypt.hash(password, salt)
}

const ValidatePassword = async (enteredPassword, savedPassword) => {
    return await bcrypt.compare(enteredPassword, savedPassword);
}

const GenerateToken = async (payload) => {
    return await jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '1d' }
    );
}

const SetTokenCookie = (res, token) => {

    return res.cookie("authToken", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, domain:"localhost"}); // Max age in milliseconds (1 day)
};

module.exports = {
    GenerateSalt,
    EncryptedPassword,
    ValidatePassword,
    GenerateToken,
    SetTokenCookie
}