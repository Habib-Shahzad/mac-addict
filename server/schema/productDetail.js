const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
    imagePath:String,
    quantity:Number,
    price:Number,
    preOrder:Boolean,
    sizes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'sizes'
        }
    ],
    colors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'colors'
        }
    ],
    createdAt:Date,
    updatedAt:Date,
});

const ProductDetail = mongoose.model('productDetails', productDetailSchema);

module.exports = ProductDetail;