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

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = "-1003924350648";

const bot = new TelegramBot(BOT_TOKEN, {
  polling: true
});

let running = false;
let timer = null;
let userLastUsed = {};

function generateRandomUserId() {
