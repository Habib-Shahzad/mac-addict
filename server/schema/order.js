const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  deliveryAddress: { type: Schema.Types.ObjectId, ref: 'addresses', required: true },
  billingAddress: { type: Schema.Types.ObjectId, ref: 'addresses', required: true },
  orderDate: { type: Date, required: true, default: new Date() },
  paymentMethod: { type: String, required: true },
  orderStatus: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  orderItems: [{ type: Schema.Types.ObjectId, ref: 'orderItems' }],
  discount: { type: Schema.Types.ObjectId, ref: 'discounts', default: null },
  user: { type: Schema.Types.ObjectId, ref: 'users', default: null }
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;