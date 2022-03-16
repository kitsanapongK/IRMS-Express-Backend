const db = require('../models');
const moment = require('moment');
const FormData = require('form-data');
const User = db.user;
const Robot = db.robot;
const jwt = require("jsonwebtoken");
const saltRounds = 10;

// Firebase
const admin = require("firebase-admin");

const sanitize = require('mongo-sanitize');

exports.users_list = async (req, res) => {
    try {
        const usersResult = await admin.auth().listUsers(1000)
        res.json(usersResult.users)
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.user_detail = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        res.status(200).send(user)
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.generate_token = async (req, res) => {
    try {
        const user = await User.findOne({ uid: sanitize(req.body.uid) })
        if (user) {
            console.log("user exist")
            let accesstoken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.ACCESS_TOKEN_LIFE
            });
            res.cookie('accessToken', accesstoken, {
                maxAge: process.env.ACCESS_TOKEN_LIFE,
                httpOnly: true,
                secure: false,
              });
            res.status(200).send(user)
        }
        else {
            console.log("user not exist")
            const firebase_user = await admin.auth().getUser(req.body.uid)
            const new_user = new User({
                uid: firebase_user.uid,
                email: firebase_user.email,
                displayName: firebase_user.displayName,
            });
            await new_user.save()
            res.status(200).send(new_user)
        }
        
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.create_user = async (req, res) => {
    await bcrypt.hash(req.body.user.password,saltRounds,(err,hash)=>{
        console.log(hash)
   try {  
        admin.auth().createUser(
            {
                email: req.body.user.email,
                emailVerified: false,
                phoneNumber:req.body.user.phone,
                password:hash,
                displayName:req.body.user.name,
                disabled: false
            })
        res.json({message:'User Created'})
   } 
   catch (err) {
        console.log(err)
        res.status(500).send(err)
   }
  })
}
