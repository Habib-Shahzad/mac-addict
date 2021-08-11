const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    keywords:String,
    description:String,
    imagePath: { type: String, required: true },
    active: { type: Boolean, required: true },
    hasColor: { type: Boolean, required: true },
    points: { type: Number, required: true },
    productDetails: [
        {
            type: Schema.Types.ObjectId,
            ref: 'productDetails',
            required: true
        }
    ],
    furtherSubCategory: {
        type: Schema.Types.ObjectId,
        ref: 'furtherSubCategories',
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'brands',
        required: true
    },
});

const Product = mongoose.model('products', ProductSchema);

module.exports = Product;