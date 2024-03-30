const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    wallet: { type: Number, required: true },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction'
    }],
    portfolios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'portfolio'
    }]
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const User = mongoose.model('user', UserSchema);

module.exports = { User };