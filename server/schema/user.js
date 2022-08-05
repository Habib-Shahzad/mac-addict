const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  uniqueToken: { type: String, unique: true },
  passwordToken: { type: String, unique: true },
  addresses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'addresses',
      required: true
    }
  ],
  admin: {
    type: Boolean,
    default: false,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  totalPoints: { type: Number, required: true, default: 0 },

  wishList: [
    {
      slug: { type: String, required: true },
    }
  ],

});
const User = mongoose.model("users", userSchema);
module.exports = User;
