const express = require('express');
const { User, Account } = require('../db');
const {JWT_SECRET} = require('../config');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const {authMiddleware} = require('../middleware')
const bcrypt = require('bcrypt');

const router = express.Router();

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post('/signup', async (req,res) => {
    const {success} = signupBody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message: 'Email already taken/ invalid inputs'
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if(existingUser){
        return res.status(411).json({
            message : "Email already taken/ invalid inputs"
        })
    }

    const salt = await bcrypt.genSalt(10);
    const secretpPassword = await bcrypt.hash(req.body.password, salt)
    const user = await  User.create({
        username: req.body.username,
        password: secretpPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    const userId = user._id;

    await Account.create({
        userId: userId,
        balance: 1 + Math.random()*10000
    })
    const token = jwt.sign({userId}, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post('/signin', async (req,res) => {
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: 'invalid inputs'
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(user){
        const userId = user.id;
        console.log(userId);
        const token= jwt.sign({
            userId: userId
        }, JWT_SECRET);
        console.log(token)

        return res.json({
            token: token
        })
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put('/update-user', authMiddleware, async (req,res) => {
    const { success } = updateBody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message: 'error while updating information'
        })
    }
    
    const user = await User.findByIdAndUpdate(req.userId, req.body)

    console.log(user);

    res.json({
        message: "Updated successfully"
    })
})

router.get('/bulk', async (req,res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        users: users
    })
})

module.exports = router;