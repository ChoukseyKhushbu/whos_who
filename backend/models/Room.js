const mongoose = require("mongoose");
const io = require("../socket");

const roomSchema = mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  currentQuesIndex: { type: Number, default: 0 },
});

roomSchema.post("save", function () {
  console.log("--------A room is created-------");
  console.log(this);
});

roomSchema.post("findOneAndUpdate", async function () {
  // console.log("Emitting roomchange event.");
  // console.log(io);
  // io.emit("roomChange", "sending data");
});

module.exports = mongoose.model("Room", roomSchema);
