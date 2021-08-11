const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    active: { type: Boolean, required: true },
    province: { type: Schema.Types.ObjectId, ref: 'provinces', required: true },
});

citySchema.virtual('areas', {
    ref: 'areas',
    localField: '_id',
    foreignField: 'city',
    justOne: false,
});

citySchema.set('toObject', { virtuals: true });
citySchema.set('toJSON', { virtuals: true });

const City = mongoose.model('cities', citySchema);

module.exports = City;