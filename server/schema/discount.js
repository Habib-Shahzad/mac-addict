const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const discountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    productDetails: [
        { item: { type: Schema.Types.ObjectId, ref: 'productDetails', required: true }, discountPercentage: { type: Number, required: true } }
    ],
    discountPercentage: { type: Number },
});

const Discount = mongoose.model('discounts', discountSchema);

module.exports = Discount;