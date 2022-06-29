const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const addresschema = new mongoose.Schema({

    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    area: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: "cities", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    zipCode: { type: String, required: true },
    landmark: { type: String },
});

const Address = mongoose.model('addresses', addresschema);
module.exports = Address;

