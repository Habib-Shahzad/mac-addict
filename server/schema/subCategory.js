const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  active: { type: Boolean, required: true },
  keywords: String,
  description: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories'
  },
});

subCategorySchema.virtual('furtherSubCategories', {
    ref: 'furtherSubCategories',
    localField: '_id',
    foreignField: 'subCategory',
    justOne: false,
});

subCategorySchema.set('toObject', { virtuals: true });
subCategorySchema.set('toJSON', { virtuals: true });

const SubCategory = mongoose.model('subCategories', subCategorySchema);

module.exports = SubCategory;