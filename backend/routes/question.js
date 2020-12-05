const express = require("express");
const Question = require("../models/Question");
const Router = express.Router();

Router.post("/create", async (req, res) => {
  const { category, question, type } = req.body;

  if (!category || !question || !type) {
    res.status(400).send({
      success: false,
      message: "Bad request",
    });
  }
  const newQuestion = new Question({
    category,
    question,
    type,
  })
    .save()
    .then((question) => {
      if (question) {
        res.status(200).send({
          success: true,
          data: question,
        });
      } else {
        res.status(500).send({
          success: "false",
          message: "Something went wrong!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
});
module.exports = Router;
