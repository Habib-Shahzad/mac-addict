const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const orderItemSchema = new mongoose.Schema({
    productDetail: { type: Schema.Types.ObjectId, ref: 'productDetails', required: true },
    quantity: { type: Number, required: true },
});

const OrderItem = mongoose.model('orderItems', orderItemSchema);

module.exports = OrderItem;