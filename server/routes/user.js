const router = require("express").Router();
const User = require("../schema").user;

const auth = require(".././middleware/auth");

require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const firebaseFile = require("../firebase");
const firebase = firebaseFile.firebase;
const firebaseAdmin = firebaseFile.admin;

// const transporter = nodemailer.createTransport({
//     host: 'smtp.yandex.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: 'no-reply@macaddictstore.com',
//       pass: 'bcramnssrlghwygt'
//     }
// });

function login(email, password) {
  return new Promise((resolve, reject) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => resolve(user))
      .catch((err) => reject(err));
  });
}

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
  try {
    await firebase.auth().verifyPasswordResetCode(req.body.actionCode);
    res.json({ data: true });
  } catch (error) {
    res.json({ data: false });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    await firebase
      .auth()
      .confirmPasswordReset(req.body.actionCode, req.body.password);
    res.json({ data: true });
  } catch (error) {
    res.json({ data: false });
  }
});

router.post("/recover-email", (req, res) => {
  // TODO
});

router.post("/verify-email", async (req, res) => {
  // TODO
});

router.post("/change-password", async (req, res) => {
  // TODO
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

      res
        .cookie("access_token", token, {
          httpOnly: true
        })
        .status(200)
        .json({ data: { firstName: user.firstName, email: user.email, emailVerified: true, admin: true } });
    }
    else {
      res.json({ data: null });
    }
  } catch (err) {

    res.json({ data: null });
  }
});



router.get("/loggedIn", async (req, res) => {
  try {
    const token = (req.cookies['access_token']);


    if (!token) {
      return res.json({ data: null });
    }
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({ _id: data.user_id });
    return res.json({ data: { firstName: user.firstName, email: user.email, emailVerified: true, admin: true } });

  } catch (error) {
    res.json({ data: null, error: error.message });
  }
});

router.post("/logout", async (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
});

router.post("/change-profile", async (req, res) => {
  const user = firebase.auth().currentUser;
  const email = user.email;
  const newEmail = req.body.email;
  const credential = firebase.auth.EmailAuthProvider.credential(
    email,
    req.body.password
  );
  try {
    await user.reauthenticateWithCredential(credential);
    const dbUser = await User.findOne({ uid: user.uid });
    await user.updateProfile({
      displayName: req.body.firstName,
    });
    dbUser.firstName = req.body.firstName;
    dbUser.lastName = req.body.lastName;
    dbUser.contactNumber = req.body.contactNumber;
    let emailChange = false;
    if (email !== newEmail) {
      await user.updateEmail(newEmail);
      user.sendEmailVerification();
      dbUser.email = newEmail;
      emailChange = true;
    }
    dbUser.save();
    const idTokenResult = await user.getIdTokenResult();
    const emailVerified = user.emailVerified;
    const admin = idTokenResult.claims.admin;
    res.json({
      data: "success",
      emailChange: emailChange,
      user: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: user.email,
        emailVerified: emailVerified,
        contactNumber: req.body.contactNumber,
        admin: admin,
      },
    });
  } catch (error) {

    res.json({ data: "failed" });
  }
});

router.get("/get-personal-info", async (req, res) => {
  const user = firebase.auth().currentUser;
  try {
    const dbUser = await User.findOne({ uid: user.uid }, { _id: 0 });
    res.json({ data: dbUser });
  } catch (error) {
    res.json({ data: null });
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
      httpOnly: true
    });


    res.json({ data: { firstName: user.firstName, email: user.email, emailVerified: true, admin: true } });

  } catch (error) {
    res.json({ success: false, error: error });
  }
});

router.post("/add", async (req, res) => {
  try {
    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(req.body.email, req.body.password);
    const user = response.user;
    await firebaseAdmin.auth().setCustomUserClaims(user.uid, { admin: true });
    user.sendEmailVerification();
    await user.updateProfile({
      displayName: req.body.firstName,
    });
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      admin: req.body.admin,
      active: req.body.active,
      uid: user.uid,
    });
    newUser.save();
    await firebase.auth().signOut();
    res.json({ success: newUser });
  } catch (error) {
    res.json({ success: false, error: error });
  }
});

router.get("/get-by-ids", async (req, res) => {
  try {
    let id = "";
    if ("id" in req.query) id = req.query.id;
    const getIds = id.split(",");
    const users = await User.find({ _id: getIds });
    res.json({ data: users });
  } catch (error) {
    res.json({ data: [], error: error });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const users = await User.find({ _id: req.body.ids }, { uid: 1 });
    users.forEach(async (admin) => {
      await firebaseAdmin.auth().deleteUser(admin.uid);
    });
    await User.deleteMany({ _id: req.body.ids });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error });
  }
});

module.exports = router;
