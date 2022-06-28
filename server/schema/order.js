const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({

  deliveryAddress: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: true },
    landmark: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: "cities", required: true },
  },

  orderDate: { type: Date, required: true, default: new Date() },
  paymentMethod: { type: String, required: true },
  orderStatus: { type: String, required: true },
  totalPrice: { type: Number, required: true },

  orderItems: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: { type: Number, required: true },
  }],

  discount: { type: Schema.Types.ObjectId, ref: 'discounts', default: null },
  user: { type: Schema.Types.ObjectId, ref: 'users', default: null }
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;

