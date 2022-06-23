const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  keywords: String,
  description: String,
  active: { type: Boolean, required: true },
});

BrandSchema.virtual('products', {
  ref: 'products',
  localField: '_id',
  foreignField: 'brand',
  justOne: false,
});

BrandSchema.set('toObject', { virtuals: true });
BrandSchema.set('toJSON', { virtuals: true });

const Brand = mongoose.model('brands', BrandSchema);

module.exports = Brand;