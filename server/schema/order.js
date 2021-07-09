const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    deliveryAddress: { type: Schema.Types.ObjectId, ref: 'addresses', required: true },
    billingAddress: { type: Schema.Types.ObjectId, ref: 'addresses', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    landmark: { type: String, required: true },
    orderDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'orderItems' }],
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;