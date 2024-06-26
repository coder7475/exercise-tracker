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
    res.status(201).json(result);
  });

  // Get /api/users - get all users
  app.get("/api/users", async (req, res) => {
    const result = await User.find();
    res.json(result);
  });

  // * POST /api/users/:_id/exercises
  // create a exercise in the database
  app.post("/api/users/:_id/exercises", async (req, res) => {
    // destruct the needed info
    const id = req.params._id;
    const { description, duration } = req.body;
    // default date value set
    let date = req.body.date;

    if (!date) date = new Date();
    else date = new Date(date);

    // find the user
    const user = await User.findById(id);

    // create exercise data
    const data = {
      user_id: user._id,
      username: user.username,
      description,
      duration,
      date,
    };

    // create the exercise in data base
    const exercise = await Exercise.create(data);
    res.json({
      _id: user._id,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString()
    })
  });

  // GET /api/users/:_id/logs?[from][&to][&limit]
  app.get("/api/users/:_id/logs", async (req, res) => {
    const id = req.params._id;
    const { from, to, limit } = req.query;
    let dateObj = {}
  if (from) {
    dateObj["$gte"] = new Date(from)
  }
  if (to){
    dateObj["$lte"] = new Date(to)
  }
    const user = await User.findById(id);
    const username = user.username;
    const filter = { username }
    if(from || to){
      filter.date = dateObj;
    }
    const exercises = await Exercise.find(filter).limit(limit);
    const log = exercises.map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString()
    }))
    res.json({
      _id: id,
      username,
      count: exercises.length,
      log,
    });
  });
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
