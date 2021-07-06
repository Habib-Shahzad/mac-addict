const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const furtherSubCategorySchema = new mongoose.Schema({
    name:String,
    slug:String,
    keywords:String,
    description:String,
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'subCategories'
    },
    createdAt:Date,
    updatedAt:Date,
});

const FurtherSubCategory = mongoose.model('furtherSubCategories', furtherSubCategorySchema);

module.exports = FurtherSubCategory;