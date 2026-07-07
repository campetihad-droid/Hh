require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

app.get("/", (req, res) => {
  res.send("Bot Running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server started");
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
  const now = Date.now();

  let repeatUsers = Object.keys(userLastUsed).filter(uid => {
    let diff = (now - userLastUsed[uid]) / 1000;
    return diff >= 300 && diff <= 600;
  });

  if (repeatUsers.length && Math.random() <= 0.4) {
    let uid = repeatUsers[
      Math.floor(Math.random() * repeatUsers.length)
    ];

    userLastUsed[uid] = now;
    return uid;
  }


  while (true) {
    let uid =
      `${Math.floor(Math.random() * 4000 + 6000)}****${Math.floor(Math.random() * 9000 + 1000)}`;

    if (!userLastUsed[uid]) {
      userLastUsed[uid] = now;
      return uid;
    }
  }
}
