const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const BrandSchema = new mongoose.Schema({
    name:String,
    slug:String,
    keywords:String,
    description:String,
    active:Boolean,
    createdAt:Date,
    updatedAt:Date,
});

const Brand = mongoose.model('brands', BrandSchema);

module.exports = Brand;