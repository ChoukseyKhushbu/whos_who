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
              expiresIn: 60 * 60 * 12, // expires in 24 hours
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
      } else {
        res.status(404).send({
          success: false,
          message: "User not found.",
        });
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
        isGuest: false,
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
              expiresIn: 60 * 60 * 12, // expires in 24 hours
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

  const newGuestUser = new User({
    username,
    isGuest: true,
  });

  newGuestUser
    .save()
    .then((user) => {
      const accessToken = jwt.sign(
        {
          sub: user.id,
          user: user.username,
          isGuest: true,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 12, // expires in 24 hours
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

Router.get("/populateUser", verifyToken, async (req, res) => {
  try {
    const { isGuest, userID, user } = req;
    const currentUser = await User.findById(userID);
    if (currentUser) {
      const accessToken = jwt.sign(
        {
          sub: userID,
          user,
          isGuest,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 12, // expires in 24 hours
        }
      );
      res.status(200).send({
        success: true,
        data: {
          user: {
            id: currentUser.id,
            username: currentUser.username,
            isGuest: currentUser.isGuest,
          },
          accessToken,
        },
        message: "User details sent.",
      });
    } else {
      res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// TEMPORARY ROUTE TO DELETE ALL USERS

Router.delete("/deleteAll", async (req, res) => {
  try {
    const response = await User.deleteMany({});
    res.send(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = Router;
