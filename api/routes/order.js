const express = require('express');
const router = express.Router();
//Import productSchema and mongoose
const Order = require('../model/order');
const mongoose = require('mongoose');

//Create GET request for this route
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request to /order'
    });
});

//Create POST request for this route
router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order
        .save()
        .exec()
        .then(result => {
            console.log(result);
            res.status(201).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    
});

//Create a get request for specific porducts targetting the productId
router.get('/:orderId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'Handling GET requests for /product/special',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'Can not handle request for this product below',
            id: id,
        })
    }
});

//Create a PATCH request for specific orders targetting the orderId
router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: "Updated Order",
    });
});

//Create a DELETE request for specific porducts targetting the orderId
router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: "Deleted Order",
    })
});
module.exports = router;