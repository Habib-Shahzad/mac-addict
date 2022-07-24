const router = require("express").Router();
const User = require("../schema").user;
const Address = require("../schema").address;
const Product = require("../schema").product;
const Coupon = require("../schema").coupon;

const admin_auth = require("./middleware/admin_auth");
const user_auth = require("./middleware/user_auth");

require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const transporter = nodemailer.createTransport({
//     host: 'smtp.yandex.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: 'no-reply@macaddictstore.com',
//       pass: 'bcramnssrlghwygt'
//     }
// });


router.post("/logout", user_auth, async (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out" });
});

router.post("/logout-admin", admin_auth, async (req, res) => {
  return res
    .clearCookie("access_token_admin")
    .status(200)
    .json({ message: "Successfully logged out" });
});


router.get("/loggedIn", async (req, res, next) => {

  const user_token = (req.cookies?.['access_token']);
  let user = null;

  if (user_token) {
    const user_data = jwt.verify(user_token, process.env.TOKEN_SECRET);
    user = await User.findOne({ _id: user_data.user_id });
  }

  const admin_token = (req.cookies?.['access_token_admin']);
  let admin_user = null;

  if (admin_token) {
    const admin_data = jwt.verify(admin_token, process.env.TOKEN_SECRET);
    admin_user = await User.findOne({ _id: admin_data.user_id });
  }

  res.json({
    successUser: user != null,
    successAdmin: admin_user != null,
    user: user,
    admin_user: admin_user
  });

  next();

});




router.get("/address-list", async (req, res) => {
  const token = (req.cookies['access_token']);

  if (!token) {
    return res.json({ data: null });
  };
  const data = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findOne({ _id: data.user_id }).populate({
    path: 'addresses',
    populate: {
      path: 'city',
      populate: {
        path: 'province',
        populate: {
          path: 'country'
        }
      }
    }
  });;

  const addresses = user.addresses;

  res.json({ success: true, data: addresses });

});



router.post('/signup', async (req, res) => {
  try {

    const { firstName, lastName, email, contactNumber, password } = req.body;

    // check if user already exist
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      contactNumber: contactNumber,
      staff: false,
      active: true
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "7000h",
      }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 7,
    });

    res.json({
      data: user
    });

  } catch (error) {
    res.json({ success: false, error: error });
  }
});



router.get(('/get-wishlist'), async (req, res) => {

  const user_token = (req.cookies?.['access_token']);
  let user = null;

  if (user_token) {
    const user_data = jwt.verify(user_token, process.env.TOKEN_SECRET);
    user = await User.findOne({ _id: user_data.user_id });

    const wishList = user.wishList;

    const products = wishList.map(async (item) => {
      const product = await Product.findOne({ slug: item.slug })
        .populate('category')
        .populate('brand');

      return product
    });

    const products_ = await Promise.all(products);

    const coupons = await Coupon.find({});

    let couponFound = false;

    coupons.forEach((coupon) => {

      if (coupon.redeemBy < new Date() && coupon.timesRedeeemed >= coupon.maxRedemptions) {
        console.log("Coupon invalid");
      }

      else {
        if (coupon.appliedToProducts && !coupon.hasPromotionCodes && !couponFound) {

          coupon.products.forEach((productObj) => {
            products_.forEach((product) => {
              product.productDetails.forEach((detail) => {
                if (product._id.toString() === productObj.product.toString()
                  &&
                  detail._id.toString() === productObj.product_detail.toString()
                ) {
                  couponFound = true;
                  if (coupon.type === "Percentage") {
                    detail.discountedPrice = detail.price - (detail.price * (coupon.percentOff / 100));
                  }
                  else if (coupon.type === "Fixed Amount") {
                    detail.discountedPrice = detail.price - coupon.amountOff;
                  }
                }
              })
            })
          })
        }
      }
    });


    const wishListProducts = products_.map((product) => {

      let prices = [];
      let discountedPrices = [];

      product.productDetails.forEach((detail) => {
        prices.push(detail.price);
        if (detail?.discountedPrice) {
          discountedPrices.push(detail.discountedPrice);
        }
      });


      const lowestPrice = Math.min(...prices);
      const highestPrice = Math.max(...prices);

      let discountAvailable = discountedPrices?.length > 0;

      const lowestDiscountedPrice = Math.min(...(discountedPrices.concat(prices)));
      const highestDiscountedPrice = Math.max(...(discountedPrices));

      if (lowestPrice === lowestDiscountedPrice && highestDiscountedPrice === highestPrice) {
        discountAvailable = false;
      }

      return {
        product_id: product._id,
        slug: product.slug,
        image: product.default_image,
        name: product.name,
        brand: product.brand.name,
        category: product.category.name,
        min_price: Math.min(...prices),
        max_price: Math.max(...prices),
        discountAvailable: discountAvailable,
        lowestDiscountedPrice: lowestDiscountedPrice,
        highestDiscountedPrice: highestDiscountedPrice
      }
    });

    res.json({ success: true, data: wishListProducts });
  }
  else {
    return res.json({ data: [] });
  }

});

router.post(('/add-to-wishlist'), async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    const user = await User.findOne({ _id: user_id });
    const product = await Product.findOne({ _id: product_id })
      .populate('brand')
      .populate('category');

    user.wishList.push({ slug: product.slug });
    await user.save();

    const prices = product.productDetails.map(item => parseFloat(item.price));
    const wishListProduct = {
      product_id: product._id,
      slug: product.slug,
      image: product.default_image,
      name: product.name,
      brand: product.brand.name,
      category: product.category.name,
      min_price: Math.min(...prices),
      max_price: Math.max(...prices),
    }

    res.json({ success: true, user: user, product: wishListProduct });

  }
  catch (error) {
    res.json({ success: false, error: error });
  }
});


router.post(('/remove-from-wishlist'), async (req, res) => {

  try {
    const { user_id, slug } = req.body;
    const user = await User.findOne({ _id: user_id });

    for (var i = 0; i < user.wishList.length; i++) {
      if (user.wishList[i].slug === slug) {
        user.wishList.splice(i, 1);
      }
    }
    await user.save();
    res.json({ success: true, user: user });
  }
  catch (error) {
    console.log("REMOVED", error);

    res.json({ success: false, error: error, user: null });
  }
});


router.post('/add', async (req, res) => {
  try {

    const { firstName, lastName, email, contactNumber, password, active, admin } = req.body;

    // check if user already exist
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ success: false, error: "User Already Exist. ", data: null });
    }

    // Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      contactNumber: contactNumber,
      admin: admin,
      active: active
    });


    res.json({
      success: true, data: newUser,
    });

  } catch (error) {
    console.log(error);

    res.json({ success: false, error: "" });
  }
});



router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "7000h",
        }
      );

      // save user token
      user.token = token;

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 7,
      });

      res.json({
        data: user
      });



    }
    else {
      res.json({ data: null });
    }
  } catch (err) {
    console.log(err);
    res.json({ data: null });
  }
});


router.post("/add-address", user_auth, async (req, res) => {
  const {
    firstName,
    lastName,
    contactNumber,
    addressLine1,
    addressLine2,
    area,
    zipCode,
    landmark,
    country,
    province,
    city }
    = req.body;

  var address = new Address(
    {
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      area: area,
      zipCode: zipCode,
      landmark: landmark,
      country: country._id,
      province: province._id,
      city: city._id
    }
  );


  const token = (req.cookies['access_token']);

  if (!token) {
    return res.json({ success: false });
  }

  const data = jwt.verify(token, process.env.TOKEN_SECRET);
  const user_id = data.user_id;
  const user = await User.findOne({ _id: user_id });

  await address.save();
  user.addresses.push(address);
  await user.save();

  const updated_user = await User.findOne({ _id: data.user_id }).populate({
    path: 'addresses',
    populate: {
      path: 'city',
      populate: {
        path: 'province',
        populate: {
          path: 'country'
        }
      }
    }
  });;

  const addresses = updated_user.addresses;
  res.json({ success: true, addresses: addresses });


});


router.post("/delete-address", user_auth, async (req, res) => {
  const { address_id } = req.body;
  const address = await Address.findOne({ _id: address_id });

  if (!address) {
    return res.json({ success: false });
  }
  await address.delete();

  const token = (req.cookies['access_token']);

  if (!token) {
    return res.json({ success: false });
  }

  const data = jwt.verify(token, process.env.TOKEN_SECRET);
  const updated_user = await User.findOne({ _id: data.user_id }).populate({
    path: 'addresses',
    populate: {
      path: 'city',
      populate: {
        path: 'province',
        populate: {
          path: 'country'
        }
      }
    }
  });;

  const addresses = updated_user.addresses;
  res.json({ success: true, addresses: addresses });

});







router.post("/admin-login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (!user.admin) {
      return res.json({ success: false, data: null, message: "User is not an admin" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "7000h",
        }
      );

      // save user token
      user.token = token;

      res.cookie("access_token_admin", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 7,
      })
        .status(200)
        .json({
          success: true,
          data: user
        });
    }
    else {
      res.json({ success: false, data: null, message: "Email and Password do not match!" });
    }
  } catch (err) {
    res.json({ data: null, success: false, message: "User not found!" });
  }
});


// -----------------------------------------------------------------

router.get("/table-data", admin_auth, async (req, res) => {
  const users = await User.find({}, { uid: 0 });
  if (!users) res.json({ data: [] });
  else res.json({ data: users });
});

router.get("/table-data-auto", admin_auth, async (req, res) => {
  const users = await User.find({}, { uid: 0 });
  if (!users) res.json({ data: [] });
  else res.json({ data: users });
});


router.post("/set-active", admin_auth, async (req, res) => {
  const { active, selected } = req.body;
  await User.updateMany({ _id: { $in: selected } }, { active: active });
  const users = await User.find({}, { uid: 0 });
  res.json({ success: true, data: users });
});

router.post("/set-admin", admin_auth, async (req, res) => {
  const { admin, selected } = req.body;
  await User.updateMany({ _id: { $in: selected } }, { admin: admin });
  const users = await User.find({}, { uid: 0 });
  res.json({ success: true, data: users });
});

router.post("/reset-password-check", async (req, res) => {
  res.json({ data: false });
  // TODO
});

router.post("/reset-password", async (req, res) => {
  res.json({ data: false });
  // TODO
});

router.post("/recover-email", (req, res) => {
  res.json({ data: false });
  // TODO
});

router.post("/verify-email", async (req, res) => {
  res.json({ data: false });
  // TODO
});


router.post("/change-password", user_auth, async (req, res) => {

  const { newPassword, oldPassword } = req.body;

  const token = (req.cookies['access_token']);

  if (!token) {
    return res.json({ success: false });
  }

  const data = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findOne({ _id: data.user_id });

  const encryptedPassword = await bcrypt.hash(newPassword, 10);

  if (user && (await bcrypt.compare(oldPassword, user.password))) {
    await User.updateOne({ _id: data.user_id }, {
      password: encryptedPassword
    });

    const updatedUser = await User.findOne({ _id: data.user_id });

    res.json({ success: true, user: updatedUser });
  }

  else {
    res.json({ success: false });
  }
});




router.post("/change-profile", user_auth, async (req, res) => {

  const { firstName, lastName, email, contactNumber, password } = req.body;

  const token = (req.cookies['access_token']);

  if (!token) {
    return res.json({ success: false });
  }

  const data = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findOne({ _id: data.user_id });

  const encryptedPassword = await bcrypt.hash(password, 10);

  if (user && (await bcrypt.compare(password, user.password))) {
    await User.updateOne({ _id: data.user_id }, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      contactNumber: contactNumber,
      password: encryptedPassword
    });

    const updatedUser = await User.findOne({ _id: data.user_id });

    res.json({ success: true, user: updatedUser });
  }

  else {
    res.json({ success: false });
  }

});


router.post('/delete', admin_auth, async (req, res) => {
  await User.deleteMany({ _id: { $in: req.body.data } });
  const users = await User.find({});
  res.json({ success: true, data: users });
});


module.exports = router;
