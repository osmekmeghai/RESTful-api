const express = require('express');
const router = express.Router();
//Import productSchema and mongoose
const Order = require('../model/order');
const Product = require('../model/product');
const mongoose = require('mongoose');

//Import controllers
const orderController = require('../controllers/order');

//For Authentication
const checkAuth = require('../middleware/check-auth');

//Create GET request for this route
router.get('/',checkAuth, orderController.order_get_all);

//Create POST request for this route
router.post('/', checkAuth, orderController.order_post_all);

//Create a get request for specific porducts targetting the orderId
router.get('/:orderId', checkAuth, orderController.order_get_one);

//Create a PATCH request for specific orders targetting the orderId
router.patch('/:orderId', checkAuth, orderController.order_patch);

//Create a DELETE request for specific porducts targetting the orderId
router.delete('/:orderId', checkAuth, orderController.order_delete);
module.exports = router;