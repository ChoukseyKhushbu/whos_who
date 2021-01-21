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
          const updatedRoom = {
            id: room.id,
            players: room.players,
            category: room.category,
            noOfQues: room.noOfQues,
            questions: room.questions.length
              ? [room.questions[room.currentQuesIndex]]
              : room.questions,
            currentQuesIndex: room.currentQuesIndex,
            answers: room.answers.length
              ? [room.answers[room.currentQuesIndex]]
              : room.answers,
            gameStarted: room.gameStarted,
          };
          res.status(200).send({
            success: true,
            data: {
              room: updatedRoom,
              isCreator: userID == room.createdBy,
              hasJoined: room.players.some((player) => player._id == userID),
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
              room: room,
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
              room: room,
              hasJoined: true,
            },
            message: "Room Joined Successfully!",
          });
          // let updatedRoom = {
          //   room: room,
          //   hasJoined: true,
          // };
          // Emitting event to display new joined user for every player
          io.in(roomID).emit("roomChange", room);
        } else {
          res.status(404).send({
            success: true,
            message: "Room Not Found",
          });
        }
      }
    });
});

Router.post("/startgame", verifyToken, async (req, res) => {
  try {
    const { roomID, noOfQues, category } = req.body;
    console.log(category);
    console.log({ roomID, noOfQues, category });
    const firstQues = await Question.aggregate()
      .match({ category: category })
      .sample(1);
    // const quesObjectIDs = questions.map((ques) => ques._id);
    if (!firstQues.length) {
      return res.status(404).send({
        success: false,
        message: "No Questions Found!",
      });
    }
    const quesObjectId = firstQues[0]._id;

    const room = await Room.findById(roomID).populate("players");

    if (!room) {
      return res.status(404).send({
        success: false,
        message: "Room Not Found",
      });
    }
    room.noOfQues = noOfQues;
    room.currentQuesIndex = 0;
    room.gameStarted = true;
    room.category = category;
    room.questions = [quesObjectId];
    room.answers = [
      room.players.reduce((acc, player) => ({ ...acc, [player._id]: [] }), {}),
    ];
    await room.save();

    const updatedRoom = {
      id: room.id,
      players: room.players,
      category: room.category,
      noOfQues: room.noOfQues,
      questions: firstQues,
      currentQuesIndex: room.currentQuesIndex,
      answers: room.answers,
      gameStarted: room.gameStarted,
    };

    io.in(roomID).emit("roomChange", updatedRoom);

    return res.status(200).send({
      success: true,
      data: {
        room: room,
      },
      message: "Room Joined Successfully!",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

Router.post("/submitanswer", verifyToken, async (req, res) => {
  try {
    const { roomID, answer } = req.body;
    const { userID } = req;

    const room = await Room.findById(roomID)
      .populate("players")
      .populate("questions");
    if (!room.players.some((player) => player._id == userID)) {
      res.status(403).send({
        success: false,
        message: "Join the Room to play!",
      });
    } else {
      if (!room.gameStarted) {
        res.status(403).send({
          success: false,
          message: "Game has not started yet!",
        });
      } else {
        room.answers[room.currentQuesIndex][answer].push(userID);
        room.markModified("answers");

        await room.save();
        const updatedRoom = {
          id: room.id,
          players: room.players,
          category: room.category,
          noOfQues: room.noOfQues,
          questions: [room.questions[room.currentQuesIndex]],
          currentQuesIndex: room.currentQuesIndex,
          answers: [room.answers[room.currentQuesIndex]],
          gameStarted: room.gameStarted,
        };

        io.in(roomID).emit("roomChange", updatedRoom);
        return res.status(200).send({
          success: true,
          data: {
            room: room,
          },
          message: "Answer Submitted Successfully!",
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

Router.post("/nextquestion", verifyToken, async (req, res) => {
  try {
    const { roomID } = req.body;
    const room = await Room.findById(roomID).populate("players");
    if (room.currentQuesIndex < room.noOfQues - 1) {
      const nextQues = await Question.aggregate()
        .match({ category: room.category, _id: { $nin: room.questions } })
        .sample(1);
      console.log({ nextQues });
      const nextQuesID = nextQues[0]._id;
      room.currentQuesIndex = room.currentQuesIndex + 1;
      room.questions = [...room.questions, nextQuesID];
      let nextAns = room.players.reduce(
        (acc, player) => ({ ...acc, [player._id]: [] }),
        {}
      );
      room.answers = [...room.answers, nextAns];

      await room.save();
      const updatedRoom = {
        id: room.id,
        players: room.players,
        category: room.category,
        noOfQues: room.noOfQues,
        questions: nextQues,
        currentQuesIndex: room.currentQuesIndex,
        answers: [nextAns],
        gameStarted: room.gameStarted,
      };
      io.in(roomID).emit("roomChange", updatedRoom);

      return res.status(200).send({
        success: true,
        data: {
          room: room,
        },
        message: "Room Joined Successfully!",
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Provided number of questions have been asked!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

Router.post("/updateOptions", verifyToken, async (req, res) => {
  try {
    const { roomID, noOfQues, category } = req.body;
    const room = await Room.findByIdAndUpdate(
      roomID,
      { noOfQues: noOfQues, category: category },
      { new: true, omitUndefined: true }
    ).populate("players");
    if (room) {
      io.in(roomID).emit("roomChange", room);
      return res.status(200).send({
        success: true,
        data: {
          room: room,
        },
        message: "Options updated Successfully!",
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Room not Found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

Router.post("/updatePlayers", verifyToken, async (req, res) => {
  try {
    let { roomID, playerID } = req.body;
    Room.findByIdAndUpdate(
      roomID,
      { $pull: { players: playerID } },
      { new: true }
    )
      .populate("players")
      .populate("questions")
      .exec(async function (err, room) {
        if (err) {
          return res.status(500).send({
            success: false,
            message: err.message,
          });
        } else {
          if (delete room.answers[room.currentQuesIndex][playerID]) {
            room.markModified("answers");
            await room.save();
            const returnedRoom = {
              id: room.id,
              players: room.players,
              category: room.category,
              noOfQues: room.noOfQues,
              questions: [room.questions[room.currentQuesIndex]],
              currentQuesIndex: room.currentQuesIndex,
              answers: [room.answers[room.currentQuesIndex]],
              gameStarted: room.gameStarted,
            };
            io.in(roomID).emit("roomChange", returnedRoom);
          } else {
            console.log("player not removed!");
          }
        }
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
Router.post("/clearRoom", verifyToken, async (req, res) => {
  const { roomID } = req.body;
  try {
    const room = await Room.findByIdAndUpdate(
      roomID,
      {
        questions: [],
        answers: [],
        gameStarted: false,
        currentQuesIndex: null,
      },
      { new: true }
    ).populate("players");
    if (room) {
      io.in(roomID).emit("roomChange", room);
      return res.status(200).send({
        success: true,
        data: {
          room: room,
        },
        message: "Options updated Successfully!",
      });
    }
  } catch (error) {
    return res.status(500).send({
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
