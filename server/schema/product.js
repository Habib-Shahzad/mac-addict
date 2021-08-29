const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    keywords: String,
    description: { type: String, required: true },
    imagePath: { type: String, required: true },
    active: { type: Boolean, required: true },
    hasColor: { type: Boolean, required: true },
    furtherSubCategory: {
        type: Schema.Types.ObjectId,
        ref: 'furtherSubCategories'
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'subCategories'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'brands',
        required: true
    },
});

ProductSchema.virtual('productDetails', {
    ref: 'productDetails',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
});

ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('products', ProductSchema);

module.exports = Product;