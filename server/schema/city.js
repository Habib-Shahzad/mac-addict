const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const citySchema = new mongoose.Schema({
    name:String,
    province: {
        type: Schema.Types.ObjectId,
        ref: 'provinces'
    },
    createdAt:Date,
    updatedAt:Date,
});

const City = mongoose.model('cities', citySchema);

module.exports = City;