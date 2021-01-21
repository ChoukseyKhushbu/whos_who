require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const app = express();
const morgan = require("morgan");

// create application/json parser
app.use(express.json());

// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(morgan("dev"));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("Database Connected!");
});

const server = require("http").createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server started listening at port ${process.env.PORT}`);
});

global.io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Yay! A client connected!", socket.id);

  // socket.join("userRoom");
  socket.on("joinRoom", function (roomID) {
    socket.join(roomID);
    console.log("Hurray! you joined socket room,", roomID);
    socket.on("chat", function (data) {
      io.in(roomID).emit("chat", data);
    });
  });

  //listener for typing message

  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });
});

const authRouter = require("./routes/auth");
const roomRouter = require("./routes/room");
const questionRouter = require("./routes/question.js");

app.get("/", (req, res) => {
  res.send("Helllo server!!!");
});
app.use("/auth", authRouter);
app.use("/room", roomRouter);

app.use("/question", questionRouter);
