const router = require("express").Router();
const User = require("../schema").user;

// const auth = require(".././middleware/auth");

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


router.post("/logout", async (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out" });
});



router.get("/loggedIn", async (req, res) => {
  try {
    const token = (req.cookies['access_token']);


    if (!token) {
      return res.json({ data: null });
    }
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({ _id: data.user_id });
    return res.json({
      data: user
    });

  } catch (error) {
    res.json({ data: null, error: error.message });
  }
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
        expiresIn: "7h",
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
          expiresIn: "7h",
        }
      );

      // save user token
      user.token = token;

      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 7,
      })
        .status(200)
        .json({
          data: user
        });
    }
    else {
      res.json({ data: null });
    }
  } catch (err) {

    res.json({ data: null });
  }
});


router.post("/addAddress", async (req, res) => {
  // const { firstName, lastName, email, contactNumber, password } = req.body;
  console.log(req.body);
});


// -----------------------------------------------------------------

router.get("/table-data", async (req, res) => {
  const users = await User.find({}, { uid: 0 });
  if (!users) res.json({ data: [] });
  else res.json({ data: users });
});

router.get("/table-data-auto", async (req, res) => {
  const users = await User.find({}, { uid: 0 });
  if (!users) res.json({ data: [] });
  else res.json({ data: users });
});



router.post("/set-active", async (req, res) => {
  const active = req.body.active;
  const selected = req.body.selected;
  await User.updateMany({}, { active: active }).where("_id").in(selected);
  const users = await User.find({}, { uid: 0 });
  res.json({ data: users });
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

router.post("/change-password", async (req, res) => {
  res.json({ data: false });
  // TODO
});









router.post("/change-profile", async (req, res) => {
  res.json({ data: "failed" });
});

router.get("/get-personal-info", async (req, res) => {
  res.json({ data: null });
});


router.post("/add", async (req, res) => {
  res.json({ data: null });
});

router.get("/get-by-ids", async (req, res) => {
  res.json({ data: null });
});

router.post("/delete", async (req, res) => {
  res.json({ data: null });
});

module.exports = router;
