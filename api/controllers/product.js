const Order = require('../model/order');
const Product = require('../model/product');
const mongoose = require('mongoose');

//get/GET all products
exports.product_get_all = (req, res, next) => {
    Product
    .find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
            const response = {
                count: docs.length,
               product: docs.map(doc => {
                   return {
                       name: doc.name,
                       price: doc.price,
                       _id: doc._id,
                       productImage: doc.productImage,
                       request: {
                           type: 'GET',
                           url: 'http://localhost:3000/product/' + doc._id
                       }
                   };
               })
            };
           res.status(200).json(response);  
    })
 
    .catch(err => {
        console.log(err);
        res.status(500).json({ 
            error: err,
        })
    })
};

//POST product
exports.product_post = (req, res, next) => {

    //Build new product with productSchema
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully ',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/product/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
        })
    })
};

//Get/GET one product
exports.product_get_one = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log('from Database ' + doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/product/'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
};

//Update/PATCH a product
exports.product_patch = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {//make edit to this

        updateOps[ops.propName] = ops.value;
        
    }
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product Updated!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/product' + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

//DELETE product
exports.product_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Delete'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};
