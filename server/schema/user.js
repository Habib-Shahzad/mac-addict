const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
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
      image: { type: String, required: true },
      name: { type: String, required: true },
      brand: { type: String, required: true },
      category: { type: String, required: true },
      min_price: { type: Number, required: true },
      max_price: { type: Number, required: true },
      slug: { type: String, required: true },
    }
  ],

});
const User = mongoose.model("users", userSchema);
module.exports = User;
