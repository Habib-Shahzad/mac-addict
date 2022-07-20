const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const couponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    amountOff: { type: Number, required: true },
    percentOff: { type: Number, required: true },
    redeemBy: { type: Date, required: true },
    maxRedemptions: { type: Number, required: true },
    appliedToProducts: { type: Boolean, required: true },
    hasPromotionCodes: { type: Boolean, required: true },
    timesRedeeemed: { type: Number, required: true },

    products: [
        {
            product_id: { type: Schema.Types.ObjectId, ref: 'products', required: true },
            product_detail_id: { type: String, required: true },
        }
    ],

    promotionCodes: [
        {
            code: { type: String, required: true },
            expiresAt: { type: Date, required: true },
            maxRedemptions: { type: Number, required: true },
            firstTimeTransaction: { type: Boolean, required: true },
            minAmount: { type: Number, required: true },
            timesRedeeemed: { type: Number, required: true },
            active: { type: Boolean, required: true },
        }
    ],

    // list of product details
    // list of promotion codes
});

const Coupon = mongoose.model('coupons', couponSchema);

module.exports = Coupon;