const router = require("express").Router();
const User = require("../schema").user;
const dotenv = require("dotenv");
dotenv.config();

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
  var restoredEmail = null;
  firebase
    .auth()
    .checkActionCode(req.body.actionCode)
    .then((info) => {
      restoredEmail = info["data"]["email"];
      return firebase.auth().applyActionCode(req.body.actionCode);
    })
    .then(() => {
      firebase
        .auth()
        .sendPasswordResetEmail(restoredEmail)
        .then(() => {
          res.json({ data: true });
        })
        .catch((error) => {
          res.json({ data: false });
        });
    })
    .catch((error) => {
      res.json({ data: false });
    });
});

router.post("/verify-email", async (req, res) => {
  try {
    await firebase.auth().applyActionCode(req.body.actionCode);
    res.json({ data: true });
  } catch (error) {
    res.json({ data: false });
  }
});

router.post("/change-password", async (req, res) => {
  const user = firebase.auth().currentUser;
  const email = user.email;
  const newEmail = req.body.email;
  const credential = firebase.auth.EmailAuthProvider.credential(
    email,
    req.body.oldPassword
  );
  try {
    await user.reauthenticateWithCredential(credential);
    await user.updatePassword(req.body.password);
    res.json({ data: true });
  } catch (error) {
    console.log(error);
    res.json({ data: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    // const response = await firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password);
    const response = await login(req.body.email, req.body.password);
    const user = response.user;
    const idTokenResult = await user.getIdTokenResult();
    const email = user.email;
    const emailVerified = user.emailVerified;
    const admin = idTokenResult.claims.admin;
    if (emailVerified === false) {
      await firebase.auth().signOut();
      res.json({ data: null });
    } else
      res.json({
        data: {
          firstName: user.displayName,
          email: email,
          emailVerified: emailVerified,
          admin: admin,
        },
      });
  } catch (error) {
    res.json({ data: null, error: error });
  }
});

router.get("/loggedIn", async (req, res) => {
  try {
    const user = firebase.auth().currentUser;
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      const email = user.email;
      const emailVerified = user.emailVerified;
      const admin = idTokenResult.claims.admin;
      res.json({
        data: {
          firstName: user.displayName,
          email: email,
          emailVerified: emailVerified,
          admin: admin,
        },
      });
    } else res.json({ data: null });
  } catch (error) {
    res.json({ data: null, error: error });
  }
});

router.post("/logout", async (req, res) => {
  try {
    await firebase.auth().signOut();
    res.json({ loggedIn: false });
  } catch (error) {
    res.json({ loggedIn: false, error: error });
  }
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
    // console.log(error);
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

// router.post('/signup', async (req, res) => {
//     try {
//         const response = await firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password);
//         const user = response.user;
//         await firebaseAdmin.auth().setCustomUserClaims(user.uid, { admin: false });
//         user.sendEmailVerification();
//         await user.updateProfile({
//             displayName: req.body.firstName,
//         });
//         const newUser = new User({
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             email: req.body.email,
//             contactNumber: req.body.contactNumber,
//             staff: false,
//             active: true,
//             uid: user.uid
//         });
//         newUser.save();
//         await firebase.auth().signOut();
//         res.json({ success: true });
//     } catch (error) {
//         res.json({ success: false, error: error });
//     }
// });

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
