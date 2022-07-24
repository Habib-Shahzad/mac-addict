const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const couponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    amountOff: { type: Number, required: true },
    percentOff: { type: Number, required: true },
    redeemBy: { type: Date, required: true },
    maxRedemptions: { type: Number, required: true },
    timesRedeeemed: { type: Number, default: 0 },
    active: { type: Boolean, default: true },

    appliedToProducts: { type: Boolean, required: true },

    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'products' },
            product_detail: { type: String },
        }
    ],

    hasPromotionCodes: { type: Boolean, required: true },

    promotionCodes: [
        {
            code: { type: String, required: true },
            expiresAt: { type: Date, required: true },
            maxRedemptions: { type: Number, required: true },
            firstTimeTransaction: { type: Boolean, required: true },
            minAmount: { type: Number, required: true },
            timesRedeeemed: { type: Number, default: 0 },
            active: { type: Boolean, required: true },
        }
    ],

});

const Coupon = mongoose.model('coupons', couponSchema);

module.exports = Coupon;