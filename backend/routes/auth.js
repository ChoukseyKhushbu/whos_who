const express = require("express");
const GuestUser = require("../models/GuestUser");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");

const Router = express.Router();

Router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .select("+password")
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const accessToken = jwt.sign(
            {
              sub: user.id,
              user: user.username,
              isGuest: false,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: 60 * 60 * 24, // expires in 24 hours
            }
          );
          res.status(200).json({
            success: true,
            data: {
              user: {
                id: user.id,
                username: user.username,
              },
              accessToken: accessToken,
            },
            message: "Successfully Logged In",
          });
        } else {
          res.status(401).json({
            success: false,
            message: "Invalid Password!",
          });
        }
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
});

Router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  bcrypt
    .hash(password, +process.env.BCRYPT_SALT_ROUNDS)
    .then((hashedPassword) => {
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      newUser
        .save()
        .then((user) => {
          const accessToken = jwt.sign(
            {
              sub: user.id,
              user: user.username,
              isGuest: false,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: 60 * 60 * 24, // expires in 24 hours
            }
          );
          // TODO: Return access token and user object
          res.status(200).json({
            success: true,
            data: {
              user: {
                id: user.id,
                username: user.username,
              },
              accessToken: accessToken,
            },
            message: "successfully registered",
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            success: false,
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
});

Router.post("/guest", (req, res) => {
  const { username } = req.body;

  // TODO: Create a new Guest
  const newGuestUser = new GuestUser({
    username,
  });

  newGuestUser
    .save()
    .then((user) => {
      // TODO: Create JWT token (username,userid in payload)
      const accessToken = jwt.sign(
        {
          sub: user.id,
          user: user.username,
          isGuest: true,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 24, // expires in 24 hours
        }
      );
      // TODO: Return access token and user object
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
          },
          accessToken: accessToken,
        },
        message: "successfully registered",
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
});

Router.post("/populateUser", async (req, res) => {
  try {
    var { accessToken } = req.body;

    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Please Register/Login to play the game!",
        });
      } else {
        const { isGuest, sub, user } = payload;
        if (isGuest) {
          const guestUser = await GuestUser.findById(sub);
          if (guestUser) {
            res.status(200).send({
              success: true,
              data: {
                user: {
                  id: guestUser.id,
                  username: guestUser.username,
                },
              },
              message: "User details sent.",
            });
          } else {
            res.status(404).send({
              success: false,
              message: "User not found.",
            });
          }
        } else {
          const registeredUser = await User.findById(sub);
          if (registeredUser) {
            res.status(200).send({
              success: true,
              data: {
                user: {
                  id: registeredUser.id,
                  username: registeredUser.username,
                },
              },
              message: "User details sent.",
            });
          } else {
            res.status(404).send({
              success: false,
              message: "User not found.",
            });
          }
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = Router;
