const User = require('../model/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Create?POST new user
exports.user_post_signup = (req, res, next) => {
    //First check to see if email exists
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if (user.length) {
            return res.status(422).json({
                message: 'This email already exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created',
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            });
        }
    })
};

//Create/POST request for login
exports.user_post_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth Failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            if (result) {
               const token = jwt.sign({
                    email:user[0].email,
                    userId:user[0]._id,
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            res.status(401).json({

                message: 'Auth Failed'
            });

        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
};


//delete?DELETE user 
exports.user_delete = (req, res, next) => {
    User.remove({_id: req.param.userId})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Account deleted',
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err,
        })
    })
};