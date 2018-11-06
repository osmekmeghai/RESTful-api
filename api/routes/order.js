const express = require('express');
const router = express.Router();
//Import productSchema and mongoose
const Order = require('../model/order');
const Product = require('../model/product');
const mongoose = require('mongoose');

//Create GET request for this route
router.get('/', (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                order: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/order/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//Create POST request for this route
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                 _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order Stored',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/order/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            });
        })
    
});

//Create a get request for specific porducts targetting the productId
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
   Order.findById(id)
   .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(500).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/order'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

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
    Order.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Deleted Order",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/order",
                    body: {
                        productId: "ID",
                        quantity: "Number"
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});
module.exports = router;