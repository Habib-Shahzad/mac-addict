const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const orderItemSchema = new mongoose.Schema({
    productDetail: { type: Schema.Types.ObjectId, ref: 'productDetails' },
    quantity:Number,
    createdAt:Date,
    updatedAt:Date,
});

const OrderItem = mongoose.model('orderItems', orderItemSchema);

module.exports = OrderItem;