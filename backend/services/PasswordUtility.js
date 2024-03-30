const bcrypt = require('bcryptjs');

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

module.exports = {
    GenerateSalt,
    EncryptedPassword,
    ValidatePassword,
}