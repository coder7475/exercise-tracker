require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: mongoose, Schema, model } = require("mongoose");

// initialize express app
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// create mongoose schema

//? User Model
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);

// ? Exercise Model
const exerciseSchema = new Schema({
  username: {
    type: "String",
  },
  date: {
    type: "Date",
  },
  duration: {
    type: "Number",
  },
  description: {
    type: "String",
  },
});

const Exercise = model("Exercise", exerciseSchema);

// Runs main function
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected to MongoDB...");

  // POST /api/users  - create a new user
  app.post("/api/users", async (req, res) => {
    const result = await User.create(req.body);
    res.json(result);
  });

  // Get /api/users - get all users
  app.get("/api/users", async (req, res) => {
    const result = await User.find();
    res.json(result);
  });

  // * POST /api/users/:_id/exercises
  app.get("/api/users/:_id/exercises", (req, res) => {
    const id = req.params._id;
  });
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
