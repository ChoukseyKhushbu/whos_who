const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  type: { type: String }, //for various types of games implemented later
});

module.exports = mongoose.model("Question", questionSchema);
