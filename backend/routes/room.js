const express = require("express");
const Router = express.Router();
const Room = require("../models/Room");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const Question = require("../models/Question");

Router.get("/data/:roomID", verifyToken, async (req, res) => {
  const { userID } = req;
  const { roomID } = req.params;
  Room.findById(roomID)
    .populate("players")
    .populate("questions")
    .exec(function (err, room) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      } else {
        if (room) {
          res.status(200).send({
            success: true,
            data: {
              room: {
                id: room.id,
                players: room.players,
                questions: room.questions,
                currentQuesIndex: room.currentQuesIndex,
              },
              isCreator: userID == room.createdBy,
              hasJoined: room.players.find((player) => player._id == userID),
            },
          });
        } else {
          res.status(404).send({
            success: true,
            message: "Room Not Found",
          });
        }
      }
    });
});
Router.get("/create", verifyToken, (req, res) => {
  const { isGuest, userID, user } = req;

  const newRoom = new Room({
    players: [userID],
    createdBy: userID,
    questions: [],
  });
  newRoom
    .save()
    .then((room) => {
      room.populate("players", function (err, room) {
        if (err) {
          res.status(500).json({
            success: false,
            message: err.message,
          });
        } else {
          res.status(200).json({
            success: true,
            data: {
              room: {
                id: room.id,
                players: room.players,
              },
              isCreator: true,
              hasJoined: true,
            },
            message: "Room Created Successfully.",
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
});

Router.get("/join/:roomID", verifyToken, async (req, res) => {
  const { user, userID, isGuest } = req;
  const { roomID } = req.params;

  Room.findByIdAndUpdate(roomID, { $push: { players: userID } }, { new: true })
    .populate("players")
    .exec(function (err, room) {
      if (err) {
        res.status(500).json({
          success: false,
          message: err.message,
        });
      } else {
        if (room) {
          res.status(200).send({
            success: true,
            data: {
              room: {
                id: room.id,
                players: room.players,
              },
              hasJoined: true,
            },
            message: "Room Joined Successfully!",
          });
          // Emitting event to display new joined user for evry player

          io.to("userRoom").emit("roomChange", room);
        } else {
          res.status(404).send({
            success: true,
            message: "Room Not Found",
          });
        }
      }
    });
});

Router.post("/game", async (req, res) => {
  try {
    const { roomID, noOfQues, category } = req.body;

    const questions = await Question.aggregate()
      .match({ category: category })
      .sample(Number(noOfQues));
    const quesObjectIDs = questions.map((ques) => ques._id);
    Room.findByIdAndUpdate(
      roomID,
      { questions: quesObjectIDs },
      (err, room) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: err.message,
          });
        } else {
          if (room) {
            res.status(200).send({
              success: true,
              data: {
                room: {
                  id: room.id,
                  players: room.players,
                  questions: room.questions,
                  currentQuesIndex: room.currentQuesIndex,
                },
              },
              message: "Room Joined Successfully!",
            });
            io.to("userRoom").emit("roomChange", room);
          } else {
            res.status(404).send({
              success: false,
              message: "Room Not Found",
            });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// TEMPORARY ROUTE TO DELETE ALL ROOMS

Router.delete("/deleteAll", async (req, res) => {
  try {
    const response = await Room.deleteMany({});
    res.send(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = Router;
