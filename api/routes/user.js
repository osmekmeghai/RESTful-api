const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/check-auth');

//Import the user model
const User = require('../model/user');

//Import controller
const userController = require('../controllers/user');

//Create a post request that collects client information and populates(POST) the database with
router.post("/signup", userController.user_post_signup);

//Create a POST request that logs in a returning client.
router.post("/login", userController.user_post_login);


//Create a delete request for deleting a User
router.delete('/:userId', checkAuth, userController.user_delete);
module.exports = router;