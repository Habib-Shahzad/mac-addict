const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    addresses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'addresses'
        }
    ],
    contactNumber:String,
    salt:String,
    hash:String,
    staff: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    token:String,
    totalPoints:Number,
    createdAt:Date,
    updatedAt:Date,
});

const User = mongoose.model('users', userSchema);

module.exports = User;