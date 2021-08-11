const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    active: { type: Boolean, required: true },
});

countrySchema.virtual('provinces', {
    ref: 'provinces',
    localField: '_id',
    foreignField: 'country',
    justOne: false,
});

countrySchema.set('toObject', { virtuals: true });
countrySchema.set('toJSON', { virtuals: true });

const Country = mongoose.model('countries', countrySchema);

module.exports = Country;