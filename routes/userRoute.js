const router = require("express").Router();
const User = require("../models/userSchema");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// Create a new user
router.post(
  "/signin",
  [
    check("name", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    //check for field errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    //create the user
    try {
      const user = new User(req.body);
      user.password = await bcrypt.hash(user.password, 8);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

//Log In
router.post("/login", async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;
    let user = await User.findOne({
      email,
    });
    if (!user) return res.status(400).send("User Not Exist");
    if (!user.verify) return res.status(400).send("Verify your email");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Incorrect Password !",
      });

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error, "something went wrng");
  }
});

//Upload Profile Picture
router.post("/pic", async (req, res) => {
  id = req.body.id;
  userPic = { img: req.body.img };
  try {
    await User.findByIdAndUpdate(id, userPic)
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  } catch (error) {
    res.status(400).send(error, "Something went wrong");
  }
});
//Update user name
router.post("/nameChange", async (req, res) => {
  id = req.body.id;
  newName = { name: req.body.name };
  try {
    await User.findByIdAndUpdate(id, newName)
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  } catch (error) {
    res.status(400).send(error, "Something went wrong");
  }
});

//--------------confirm session------------
router.get("/me", auth, (req, res) => {
  // View logged in user profile
  res.send(req.user);
});

//log out all tokens from everywhere
router.post("/logout", auth, async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send(`${req.user.name} logged out`);
  } catch (error) {
    res.status(500).send("Eror can't log out");
  }
});

//-----Change Password---
router.post("/passChange", auth, async (req, res) => {
  //get all the variables
  let newPassword = req.body.newPass;
  let oldPass = req.body.oldPass;
  let id = req.body.id;
  let user = await User.findById(id);
  let isMatch = await bcrypt.compare(oldPass, user.password);

  try {
    // validate
    if (!user) return res.status(400).send("User Not Exist");
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect Password !" });
    //encrypt and save new password
    user.password = await bcrypt.hash(newPassword, 8);
    await user.save();
    res.status(201).send("Password Changed");
  } catch (errors) {
    res.status(400).send("Error: ", errors);
  }
});

// --------- Send EMAIL CONFIRMATION -----
router.post("/emailvref", async (req, res) => {
  //get the user credentials and store them
  let email = req.body.email;
  let uid = req.body.id;

  try {
    // configure the nodemailer params
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.G_TEST_USER.toString(),
        pass: process.env.G_TEST_PASS.toString(),
      },
    });

    // send mail with defined transport object
    transporter.sendMail(
      {
        from: '"Verify" <reg-verification@testapp.com>', // sender address
        to: email, // list of receivers
        subject: "Reg. Verification", // Subject line
        //text: "Hello world?", // plain text body
        html: `<h3>Thank you for your registration!</h3> </br> 
        <p> Click here to confirm your email: <a href="https://blog-anything.herokuapp.com/user/verify/${uid}"> Verify</a></p>
        </br> 
        <p><b>Pleace do NOT respond to this email</b></p>
        `,
      },
      (error, resp) => {
        if (error) {
          console.log(error);
          res.end("err: ", error);
        } else {
          console.log("Verification email send");
          res.end("Verification email send");
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.end("Error: ", err);
  }
});

//Verify the email
router.get("/verify/:id", async (req, res) => {
  let pathPart = req.path.split("/");
  let newUserId = pathPart[2];
  try {
    let user = await User.findById(newUserId);
    if (user.verify) {
      res.redirect("https://blog-anything.herokuapp.com/");
    } else {
      user.verify = true;
      await user.save();
      res.status(201).redirect("https://blog-anything.herokuapp.com/verify");
    }
  } catch (err) {
    res.status(400).send("No user match");
  }
});

// //user log out current token only
// router.post("/logout", auth, async (req, res) => {
//   // Log user out of the application
//   try {
//     req.user.tokens = req.user.tokens.filter((token) => {
//       return token.token != req.token;
//     });
//     await req.user.save();
//     res.send();
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// //---------------Get all users-----------
// router.route("/").get((req, res) => {
//   User.find()
//     .then((users) => res.json(users))
//     .catch((err) => res.status(400).json("error: " + err));
// });

module.exports = router;
