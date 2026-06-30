const express = require("express");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json());

const VERIFY_TOKEN = "kizik-ai";

const PHONE_NUMBER_ID = "1108218925717939";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

const GEMINI_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: GEMINI_KEY,
});

app.get("/", (req, res) => {
  res.send("Kızık AI Aktif");
});
// GEMINI

const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash"
});

async function askGemini(userMessage) {

    const result = await model.generateContent(`

Sen Kızık AI'sın.

Kuralların:

- Türkçe konuş.
- Kısa ve anlaşılır cevap ver.
- Elektrik konusunda uzmansın.
- Tarım konusunda uzmansın.
- Hayvancılık konusunda uzmansın.
- ESP32, Arduino, PLC, Elektrik Panoları konusunda uzmansın.
- Kullanıcının adı Mehmet.

Kullanıcı:

${userMessage}

`);

    return result.response.text();

}
async function sendWhatsApp(to, text) {

    await axios.post(

        `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`,

        {

            messaging_product: "whatsapp",

            to: to,

            text: {

                body: text

            }

        },

        {

            headers: {

                Authorization: `Bearer ${WHATSAPP_TOKEN}`,

                "Content-Type": "application/json"

            }

        }

    );

}
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
