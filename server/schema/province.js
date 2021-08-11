const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const provinceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    active: { type: Boolean, required: true },
    country: { type: Schema.Types.ObjectId, ref: 'countries', required: true },
});

provinceSchema.virtual('cities', {
    ref: 'cities',
    localField: '_id',
    foreignField: 'province',
    justOne: false,
});

provinceSchema.set('toObject', { virtuals: true });
provinceSchema.set('toJSON', { virtuals: true });

const Province = mongoose.model('provinces', provinceSchema);

module.exports = Province;