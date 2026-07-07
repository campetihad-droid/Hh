require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = "-1003924350648";
const WEBHOOK_URL = process.env.WEBHOOK_URL; // e.g., https://yourapp.onrender.com
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(BOT_TOKEN, {
  webHook: {
    port: PORT,
    host: "0.0.0.0"
  }
});

// Set webhook
bot.setWebHook(`${WEBHOOK_URL}/bot${BOT_TOKEN}`);

app.post(`/bot${BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("✅ Telegram Bot Running on Webhook Mode");
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
    let uid = repeatUsers[Math.floor(Math.random() * repeatUsers.length)];
    userLastUsed[uid] = now;
    return uid;
  }

  while (true) {
    let uid = `${Math.floor(Math.random() * 4000 + 6000)}****${Math.floor(Math.random() * 9000 + 1000)}`;
    if (!userLastUsed[uid]) {
      userLastUsed[uid] = now;
      return uid;
    }
  }
}

function buildMessage(userId, amount, runTime, trackTime) {
  return `Test Conversation Count 💝

🎁 Offer Name - Test

User Id : ${userId}
User Amount : ₹${amount}
🥳 User Payment : Success

Run Time - ${runTime}
Track Time - ${trackTime}

Powered By - CashFlix`;
}

function sendSecondMessage(userId, runTime) {
  setTimeout(() => {
    bot.sendMessage(CHANNEL_ID, buildMessage(userId, "5", runTime, new Date().toLocaleString()))
      .catch(err => console.error("Error sending message:", err));
  }, 60000);
}

function startConversation() {
  timer = setInterval(async () => {
    if (!running) return;

    for (let i = 0; i < 10; i++) {
      let now = new Date();
      let userId = generateRandomUserId();
      let runTime = new Date(now.getTime() - 60000).toLocaleString();
      let trackTime = now.toLocaleString();

      try {
        await bot.sendMessage(CHANNEL_ID, buildMessage(userId, "0.1", runTime, trackTime));
        sendSecondMessage(userId, runTime);
      } catch (err) {
        console.error("Error in startConversation:", err);
      }
    }
  }, 2000);
}

bot.onText(/\/test/, (msg) => {
  if (running) {
    return bot.sendMessage(msg.chat.id, "⚠️ Test already running.");
  }

  running = true;
  startConversation();
  bot.sendMessage(msg.chat.id, "✅ Test Started.");
});

bot.onText(/\/stop/, (msg) => {
  running = false;

  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  bot.sendMessage(msg.chat.id, "🛑 Test Stopped.");
});

app.listen(PORT, () => {
  console.log(`🚀 Bot Running on PORT ${PORT} (Webhook Mode)`);
});
