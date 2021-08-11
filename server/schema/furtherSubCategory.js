const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const furtherSubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  active: { type: Boolean, required: true },
  keywords: String,
  description: String,
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: 'subCategories'
  },
});

furtherSubCategorySchema.virtual('products', {
    ref: 'products',
    localField: '_id',
    foreignField: 'furtherSubCategory',
    justOne: false,
});

furtherSubCategorySchema.set('toObject', { virtuals: true });
furtherSubCategorySchema.set('toJSON', { virtuals: true });

const FurtherSubCategory = mongoose.model('furtherSubCategories', furtherSubCategorySchema);

module.exports = FurtherSubCategory;