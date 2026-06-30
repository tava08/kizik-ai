const express = require("express");

const app = express();

// JSON desteği
app.use(express.json());

// Tüm istekleri logla
app.use((req, res, next) => {
  console.log("====================================");
  console.log("Tarih :", new Date().toLocaleString());
  console.log("Method:", req.method);
  console.log("URL   :", req.originalUrl);
  next();
});

// Meta doğrulama anahtarı
const VERIFY_TOKEN = "kizik-ai";

// Ana sayfa
app.get("/", (req, res) => {
  res.send("Kızık AI çalışıyor.");
});

// Webhook doğrulaması (Meta ilk kurulum)
app.get("/webhook", (req, res) => {

  console.log("GET /webhook geldi");
  console.log(req.query);

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {

    console.log("✅ Webhook doğrulandı.");

    return res.status(200).send(challenge);
  }

  console.log("❌ Hatalı doğrulama.");
  return res.sendStatus(403);
});

// WhatsApp'tan gelen webhooklar
app.post("/webhook", (req, res) => {

  console.log("====================================");
  console.log("📨 POST /webhook GELDİ");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("====================================");

  res.sendStatus(200);
});

// Hataları yakala
app.use((err, req, res, next) => {
  console.error("SUNUCU HATASI:");
  console.error(err);
  res.sendStatus(500);
});

// Sunucuyu başlat
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("====================================");
  console.log(`🚀 Server çalışıyor : ${PORT}`);
  console.log(`🌐 https://kizik-ai.onrender.com`);
  console.log("====================================");
});
