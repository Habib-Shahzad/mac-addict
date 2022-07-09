const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const productDetailSchema = new mongoose.Schema({
    imageList: [{
        image: { type: String },
    }],

    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    points: { type: Number, required: true },
    preOrder: { type: Boolean, required: true },
    size: {
        type: Schema.Types.ObjectId,
        ref: 'sizes',
        required: true
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: 'colors'
    },
});

const ProductDetail = mongoose.model("productDetails", productDetailSchema);
module.exports = ProductDetail;
