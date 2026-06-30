const express = require("express");

const app = express();

// TÜM İSTEKLERİ LOGLA
app.use((req, res, next) => {
  console.log("================================");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("HEADERS:", req.headers);
  next();
});

app.use(express.json());

const VERIFY_TOKEN = "kizik-ai";

// Ana sayfa
app.get("/", (req, res) => {
  res.send("Kızık AI çalışıyor.");
});

// Meta doğrulama
app.get("/webhook", (req, res) => {
  console.log("GET WEBHOOK");

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook doğrulandı.");
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

// WhatsApp mesajları
app.post("/webhook", (req, res) => {
  console.log("POST WEBHOOK GELDİ");
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server çalışıyor:", PORT);
});
