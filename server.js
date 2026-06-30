const express = require("express");

const app = express();

const VERIFY_TOKEN = "kizik-ai";

// Her isteği logla
app.use((req, res, next) => {
  console.log("================================");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("HEADERS:", req.headers);
  next();
});

// Ham body'yi de yakala
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

app.get("/", (req, res) => {
  res.send("Kızık AI çalışıyor.");
});

app.get("/webhook", (req, res) => {
  console.log("GET /webhook");

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook doğrulandı.");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("POST WEBHOOK GELDİ");

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (message) {
      const from = message.from;
      const name = value.contacts?.[0]?.profile?.name || "Bilinmiyor";
      const text = message.text?.body || "";

      console.log("================================");
      console.log("Gönderen :", name);
      console.log("Numara   :", from);
      console.log("Mesaj    :", text);
      console.log("================================");
    } else {
      console.log("Mesaj yok.");
    }
  } catch (err) {
    console.error("Webhook Hatası:", err);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server çalışıyor: ${PORT}`);
});
