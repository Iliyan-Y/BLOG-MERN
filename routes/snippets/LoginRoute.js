const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//local
let User = require("../models/userSchema");

router.post(
  "/",
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
        "secret",
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

module.exports = router;
