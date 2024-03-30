const { User } = require('../models/User');
const FindUser = require('../services/FindUser');
const { GenerateSalt, EncryptedPassword, ValidatePassword } = require('../services/PasswordUtility');

const userSignup = async (req, res, next) => {
    const { name, phone, email, password } = req.body;

    try {
        const existingUser = FindUser('', email);
    
        if (existingUser !== null) {
            return res.status(409).json({ message: "User already exists with this Email" })
        }
    
        const salt = await GenerateSalt();
        const userPassword = await EncryptedPassword(password, salt);
    
        const createUser = User.create({ 
            name: name, 
            phone: phone, 
            email: email, 
            password: userPassword,
            salt: salt,
            wallet: 0,
            transactions: [],
            portfolios: []
        });
    
        return res.status(201).json({ message: "Signup Succesful!", createUser });

    } catch (error) {
        console.error("Error adding User:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

module.exports = {
    userSignup,
}