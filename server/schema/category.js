const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    active: { type: Boolean, required: true },
    keywords: String,
    description: String,
});

categorySchema.virtual('subCategories', {
    ref: 'subCategories',
    localField: '_id',
    foreignField: 'category',
    justOne: false,
});

categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;