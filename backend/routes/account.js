const express = require('express');
const { authMiddleware } = require('../middleware');
const {Account} = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get('/balance', authMiddleware, async (req,res) => {
    const user = await Account.findOne({userId: req.userId});
    
    if(!user){
        res.status(411).json({
            messgae: "User doesn't exist"
        })
    }
    res.json({
        amount: user.amount
    })
})


router.post('/transfer', authMiddleware, async (req,res) => {
    const { to, amount } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const account = await Account.findOne({userId: req.userId}).session(session);

    console.log(account);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            messgae: "Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({userId: to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            messgae: "Invalid account"
        })
    }

    console.log("here");

    await Account.updateOne({userId: req.userId}, {$inc : {balance: -amount}}).session(session);
    await Account.updateOne({userId: to}, {$inc: {balance: + amount}}).session(session);

    await session.commitTransaction();

    res.json({
        message: "Transfer Successful"
    })

})

module.exports = router;


