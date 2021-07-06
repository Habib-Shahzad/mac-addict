const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const addresschema = new mongoose.Schema({
    addressLine1:String,
    addressLine2:String,
    postalCode:String,
    area: {
        type: Schema.Types.ObjectId,
        ref: 'areas'
    },
    createdAt:Date,
    updatedAt:Date,
});

const Area = mongoose.model('addresses', addresschema);

module.exports = Area;