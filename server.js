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
