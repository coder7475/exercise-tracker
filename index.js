require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");

// initialize express app
const app = express();

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// POST /api/users  - create a new user
// app.post('/api/users')

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
