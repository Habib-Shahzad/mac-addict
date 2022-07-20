const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const promotionCodeSchema = new mongoose.Schema({
    code: { type: String, required: true },
    coupon_id: {
        type: Schema.Types.ObjectId,
        ref: 'coupons',
        required: true
    },
    expiresAt: { type: Date, required: true },
    maxRedemptions: { type: Number, required: true },
    firstTimeTransaction: { type: Boolean, required: true },
    minAmount: { type: Number, required: true },
    timesRedeeemed: { type: Number, required: true },
    active: { type: Boolean, required: true },
});

const PromotionCode = mongoose.model('promotionCodes', promotionCodeSchema);

module.exports = PromotionCode;