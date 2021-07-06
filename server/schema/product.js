const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
    name:String,
    slug:String,
    keywords:String,
    description:String,
    imagePath:String,
    active:Boolean,
    productDetails: [
        {
            type: Schema.Types.ObjectId,
            ref: 'productDetails'
        }
    ],
    furtherSubCategory: {
        type: Schema.Types.ObjectId,
        ref: 'furtherSubCategories'
    },
    brands: {
        type: Schema.Types.ObjectId,
        ref: 'brands'
    },
    createdAt:Date,
    updatedAt:Date,
});

const Product = mongoose.model('products', ProductSchema);

module.exports = Product;