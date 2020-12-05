const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String },
  password: { type: String, select: false },
  isGuest: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", userSchema);
