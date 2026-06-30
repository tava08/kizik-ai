const express = require("express");
const axios = require("axios");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "kizik-ai";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = "1108218925717939";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---------------- Ana Sayfa ----------------

app.get("/", (req, res) => {
  res.send("Kızık AI çalışıyor.");
});

// ---------------- Meta Doğrulama ----------------

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook doğrulandı.");
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

// ---------------- WhatsApp Webhook ----------------

app.post("/webhook", async (req, res) => {

  console.log("Yeni mesaj geldi.");

  try {

    const body = req.body;

    if (!body.entry) {
      return res.sendStatus(200);
    }

    const message =
      body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const userMessage = message.text?.body || "";

    console.log("Kullanıcı:", from);
    console.log("Mesaj:", userMessage);

    // OpenAI

    const ai = await openai.responses.create({
      model: "gpt-5.5",
      input: userMessage
    });

    const cevap = ai.output_text;

    console.log("AI:", cevap);

    // WhatsApp'a gönder

    await axios.post(
      `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: {
          body: cevap
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Cevap gönderildi.");

    res.sendStatus(200);

  } catch (err) {

    console.log("HATA");

    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log(err.message);
    }

    res.sendStatus(500);
  }

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server çalışıyor:", PORT);
});
