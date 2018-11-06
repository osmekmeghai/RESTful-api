const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},
    quantity: {type: Number, default: 1}
})
//Export the order Schema wrapped in a model
module.exports = mongoose.model('Order', orderSchema);