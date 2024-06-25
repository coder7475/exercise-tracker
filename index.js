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
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
