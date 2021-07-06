const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const subCategorySchema = new mongoose.Schema({
    name:String,
    slug:String,
    keywords:String,
    description:String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    createdAt:Date,
    updatedAt:Date,
});

const SubCategory = mongoose.model('subCategories', subCategorySchema);

module.exports = SubCategory;