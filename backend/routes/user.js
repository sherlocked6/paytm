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
            message : "user already exists"
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

    console.log(req.body)

    const user = await User.findOne({
        username: req.body.username
    })

    if (!user) {
        return res
            .status(404)
            .json({ success: success, message: 'User not found' })
    }

    const comparePassword = await bcrypt.compare(req.body.password, user.password);

    if(!comparePassword){
        return res.status(403).json({
            success: success,
            message: ' Please enter correct credentials',
          })
    }
    const userId = user.id;
    console.log(userId);
    const token= jwt.sign({
        userId: userId
    }, JWT_SECRET);
    console.log(token)

    return res.json({
        token: token
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
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

router.get('/getUser/:id', async (req,res) => {
    console.log(req.params.id)
    const userId = req.params.id || null;
    
    let success = false
    if(!userId){
        return res.status(400).json({
            message: "Please enter user id"
        })
    }
    const user = await User.findById(userId);

    if(!user){
        res.status(400).json({
            success: success,
            message: "no user found with given userId"
        })
    }else{
        success = true;
        res.json({
            success: success,
            message: "User found",
            user: user
        })
    }
})

module.exports = router;