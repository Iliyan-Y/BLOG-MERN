const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectID } = require("mongodb");
require("dotenv").config();

//Require Schema
let User = require("../models/userSchema");
const auth = require("../middleware/auth");

//---------------Get all users-----------
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("error: " + err));
});

//----------------Create a new User--------------------
router.route("/reg").post(
  //validate all the fields are correct
  [
    check("name", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("pass", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  //create new user
  async (req, res) => {
    const errors = validationResult(req); //asign if any error on validations created

    const salt = await bcrypt.genSalt(10); // create the encription formula

    //check for errors asigned
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const name = req.body.name;
    const pass = req.body.pass;
    const email = req.body.email;

    //try to create user and catch if any errors
    try {
      let newUser = await User.findOne({
        email,
      }); //check if email already exist in the db
      if (newUser) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }
      //create the new user
      newUser = new User({
        name,
        email,
        pass,
      });

      //get the current input of the password and encrypt it
      newUser.pass = await bcrypt.hash(pass, salt);
      //wait until evrithing above finish and save the user to the db with the encrypted password
      await newUser.save();

      //create the jwt identification token based on the user unique ID from the db
      const payload = {
        user: {
          id: newUser.id,
        },
      };
      //sign the token
      jwt.sign(
        payload,
        process.env.SECRET_TOKEN,
        {
          expiresIn: 10000, //time of expiry
        },
        (err, token) => {
          if (err) throw err;
          //if evrithing fine send the token
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

//---------------Establish Session------------------
router.route("/me").get(auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

// //----------------get a single user by id----------------
// router.route("/:id").get((req, res) => {
//   User.findById(req.params.id)
//     .then((data) => res.json(data))
//     .catch((err) => res.status(400).json(err));
// });

// ----------------Update user----------------
// router.route("/:id").post((req, res) => {
//   //find the current data
//   User.findById(req.params.id).then((data) => {
//     //add new data
//     data.username = req.body.username;

//     //save the data
//     data
//       .save()
//       .then((info) => res.json(info.title + " post updated !"))
//       .catch((err) => res.status(400).json(err));
//   });
// });

//----------------Log IN --------------------
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("pass", "Please enter a valid pass").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, pass } = req.body;

    try {
      let user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist",
        });

      const isMatch = await bcrypt.compare(pass, user.pass);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !",
        });

      //CREATE jwt session token

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.SECRET_TOKEN,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

//--------Log Out ---------

router.post("/logout", auth, async (req, res) => {
  // Log user out of the application

  try {
    console.log(req.user.token);
    req.user.token = req.user.token.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send("User logged out");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
