const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:String,
    slug:String,
    keywords:String,
    description:String,
    createdAt:Date,
    updatedAt:Date,
});

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;