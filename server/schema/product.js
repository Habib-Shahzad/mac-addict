const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    keywords: String,
    description: String,
    product_description: { type: String, required: true },

    active: { type: Boolean, required: true },
    hasColor: { type: Boolean, required: true },

    furtherSubCategory: {
        type: Schema.Types.ObjectId,
        ref: "furtherSubCategories",
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "subCategories",
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "categories",
        required: true,
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "brands",
        required: true,
    },

    productDetails: [{
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
    }],



});


ProductSchema.set("toObject", { virtuals: true });
ProductSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;
