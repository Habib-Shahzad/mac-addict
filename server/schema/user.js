const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  addresses: [
    {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, required: true },
      landmark: { type: String, required: true },
      area: {
        name: { type: String, required: true },
        city: { type: Schema.Types.ObjectId, ref: "cities", required: true },
      },
    },
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
  uid: { type: String, required: true },
});
const User = mongoose.model("users", userSchema);

// const create = async _ => {
//     const user = await new User({
//         firstName: 'Murtaza',
//         lastName: 'Faisal Shafi',
//         email: 'murtazashafi11@gmail.com',
//         contactNumber: '03071711905',
//         admin: true,
//         active: true,
//         uid: 'ImfEvAfnnaVnCkTU7kDn1VomLvH3'
//     });
//     user.save();
//     console.log(123);
// }
// create();

module.exports = User;
