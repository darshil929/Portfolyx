const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const FindUser = require('../services/FindUser');
const { GenerateSalt, EncryptedPassword, ValidatePassword, GenerateToken, SetTokenCookie } = require('../services/PasswordUtility');

const userSignup = async (req, res, next) => {
    const { name, phone, email, password } = req.body;

    try {
        const existingUser = await FindUser('', email);

        if (existingUser !== null) {
            return res.status(409).json({ message: "User already exists with this Email" })
        }

        const salt = await GenerateSalt();
        const userPassword = await EncryptedPassword(password, salt);

        const createUser = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: userPassword,
            salt: 10,
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

const userLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        console.log(existingUser);
        if (existingUser == null) {
            return res.status(409).json({ message: "Login Credentials Invalid" })
        }

        const validation = await ValidatePassword(password, existingUser.password);
        if (validation) {

            const token = await GenerateToken({
                _id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
                foodTypes: existingUser.foodType
            });

            SetTokenCookie(res, token);

            return res.status(200).json({ message: "Login Successful", existingUser });
        } else {
            return res.status(400).json({
                message:
                    "Invalid Password! Try Again"
            });
        }

    } catch (error) {
        console.error("Error adding User:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

module.exports = {
    userSignup,
    userLogin,
}