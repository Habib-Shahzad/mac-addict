const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name:String,
    createdAt:Date,
    updatedAt:Date,
});

const Country = mongoose.model('countries', countrySchema);

module.exports = Country;