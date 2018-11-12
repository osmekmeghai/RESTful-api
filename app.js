const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Apply to incoming requests
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Makes it possible to view images that are posted
app.use('/uploads', express.static(' uploads\\2018-11-07T16-17-22.551Zproject2.jpeg-uploads'))

//connect to the database
mongoose.connect(
    'mongodb+srv://osmek101:' + process.env.MONGO_ATLAS_PW + '@product-oujbf.mongodb.net/test?retryWrites=true',
    {
        useNewUrlParser: true
    }
);

//Handling CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    //Create an Option to determine the request method to allow
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});



//Require your /product routes and their methods
const productRoutes = require('./api/routes/product');

//Require your /order routes and their methods
const orderRoutes = require('./api/routes/order');

//Require your /user routes and their methods
const userRoutes = require('./api/routes/user');

app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/user', userRoutes);

//Create route for error handling 
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);

})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    })
})
module.exports = app;