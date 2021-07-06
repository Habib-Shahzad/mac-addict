const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    name:String,
    createdAt:Date,
    updatedAt:Date,
});

const Size = mongoose.model('sizes', sizeSchema);

module.exports = Size;