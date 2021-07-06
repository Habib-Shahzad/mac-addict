const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const areaSchema = new mongoose.Schema({
    name:String,
    city: {
        type: Schema.Types.ObjectId,
        ref: 'cities'
    },
    createdAt:Date,
    updatedAt:Date,
});

const Area = mongoose.model('areas', areaSchema);

module.exports = Area;