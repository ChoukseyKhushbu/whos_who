const mongoose = require("mongoose");

const GuestUserSchema = mongoose.Schema({
  username: { type: String, required: true },
});

module.exports = mongoose.model("GuestUser", GuestUserSchema);
