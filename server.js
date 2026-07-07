require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

app.get("/", (req, res) => {
  res.send("Bot Running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Running");
});
