require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// create application/json parser
app.use(express.json());

// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));

app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("Database Connected!");
});

const authRouter = require("./routes/auth");

app.get("/", (req, res) => {
  res.send("Helllo server!!!");
});
app.use("/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server started listening at port ${process.env.PORT}`);
});
