const mongoose = require("mongoose");
const { string, number } = require("zod");
const { MONGO_URL } = require("./config");


mongoose.connect(MONGO_URL);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    firstName: {
        type: String,
        required: true,
        maxLength: 30,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    }
})


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})


const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema)

module.exports = {
    User,
    Account
}