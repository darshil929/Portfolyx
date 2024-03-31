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
                name: existingUser.name
            });

            SetTokenCookie(res, token);

            return res.status(200).json({ message: "Login Successful", existingUser, token });
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

const getUserProfile = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }

        const userDetails = await FindUser(user._id, '');
        if (!userDetails) {
            return res.status(404).json({ message: "No such user Exists!" });
        }

        const fulluser = await userDetails.populate('portfolios');
        return res.status(200).json(fulluser);

    } catch (error) {
        console.error("Error fetching user info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateWalletProfile = async (req, res, next) => {
    const { walletmoney } = req.body;
    try { 
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Update only the wallet money field
        const existingUser = await User.findOne({_id : user._id});
        
        existingUser.wallet = walletmoney;
        const savedResult = await existingUser.save();
        return res.status(200).json({ message: "Money Added Successfully", savedResult });
    } catch (error) {
        console.error("Error updating wallet money:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {
    userSignup,
    userLogin,
    getUserProfile,
    updateWalletProfile
}
