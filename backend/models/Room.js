const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  currentQuesIndex: { type: Number, default: null },
  category: { type: String, default: null },
  noOfQues: { type: String, default: null },
  answers: [],
  gameStarted: { type: Boolean, default: false },
});

roomSchema.post("save", function () {
  // console.log("--------A room is created-------");
  console.log("save: ");

  console.log(this);
});

roomSchema.post("findOneAndUpdate", async function () {
  // console.log("Emitting roomchange event.");
  // console.log(io);
  // io.emit("roomChange", "sending data");
  console.log("update: ");
  console.log(this);
});

module.exports = mongoose.model("Room", roomSchema);
