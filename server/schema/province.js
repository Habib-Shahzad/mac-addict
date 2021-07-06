const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const provinceSchema = new mongoose.Schema({
    name:String,
    country: {
        type: Schema.Types.ObjectId,
        ref: 'countries'
    },
    createdAt:Date,
    updatedAt:Date,
});

const Province = mongoose.model('provinces', provinceSchema);

module.exports = Province;