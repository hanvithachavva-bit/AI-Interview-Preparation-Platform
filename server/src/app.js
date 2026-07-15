const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 AI Interview Preparation Platform Backend is Running!");
});

module.exports = app;