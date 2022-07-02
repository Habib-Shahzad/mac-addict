const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({

  deliveryAddress: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    area: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: "cities", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    zipCode: { type: String, required: true },
    landmark: { type: String },
  },

  orderDate: { type: Date, required: true, default: new Date() },
  paymentMethod: { type: String, required: true, default: null },
  orderStatus: { type: String, required: true, default: false },
  totalPrice: { type: Number, required: true },

  orderItems: [{
    images: [{ image: { type: String } }],
    product_id: { type: Schema.Types.ObjectId, ref: "products", required: true },
    name: { type: String, required: true },

    brand: {
      type: Schema.Types.ObjectId,
      ref: 'brands',
      required: true
    },

    hasColor: { type: Boolean, required: true },

    size: {
      type: Schema.Types.ObjectId,
      ref: 'sizes',
      required: true
    },

    quantity: { type: Number, required: true },

    color: {
      type: Schema.Types.ObjectId,
      ref: 'colors'
    },

    price: { type: Number, required: true },
    points: { type: Number, required: true },
    preOrder: { type: Boolean, required: true },
    key: { type: String, required: true }

  }],

  discount: { type: Schema.Types.ObjectId, ref: 'discounts', default: null },
  user: { type: Schema.Types.ObjectId, ref: 'users', required: true }
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;

