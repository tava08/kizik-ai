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
  console.log("================================");
  console.log("POST /webhook GELDİ");
  console.log("RAW BODY:");
  console.log(req.rawBody);
  console.log("JSON BODY:");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("================================");

  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server çalışıyor: ${PORT}`);
});
