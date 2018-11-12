const express = require('express');
const router = express.Router();

//Import productSchema and mongoose
const Product = require('../model/product');
const mongoose = require('mongoose');

//For Authentication
const checkAuth = require('../middleware/check-auth');

//Import controllers
const productController = require('../controllers/product');

//Require multer to help upload files e.g images
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});//Helps tweak your storage strategy
//you can add addition al filters
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//Create GET request for this route
router.get('/', productController.product_get_all);

//Create POST request for this route
router.post('/', checkAuth, upload.single('productImage'), productController.product_post);

//Create a get request for specific porducts targetting the productId
router.get('/:productId', productController.product_get_one);

//Create a PATCH request for specific porducts targetting the productId
router.patch('/:productId', checkAuth, productController.product_patch);

//Create a DELETE request for specific porducts targetting the productId
router.delete('/:productId', checkAuth, productController.product_delete);
module.exports = router;