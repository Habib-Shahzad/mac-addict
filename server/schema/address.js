const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const addresschema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    landmark: { type: String },
    city: { type: Schema.Types.ObjectId, ref: "cities", required: true },
});

const Address = mongoose.model('addresses', addresschema);
module.exports = Address;
