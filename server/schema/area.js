const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const areaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    active: { type: Boolean, required: true },
    city: { type: Schema.Types.ObjectId, ref: 'cities', required: true },
});

areaSchema.virtual('addresses', {
    ref: 'addresses',
    localField: '_id',
    foreignField: 'area',
    justOne: false,
});

areaSchema.set('toObject', { virtuals: true });
areaSchema.set('toJSON', { virtuals: true });

const Area = mongoose.model('areas', areaSchema);

module.exports = Area;