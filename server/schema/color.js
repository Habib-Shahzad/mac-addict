const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name:String,
    createdAt:Date,
    updatedAt:Date,
});

const Color = mongoose.model('colors', colorSchema);

module.exports = Color;