/**
 * ==========================================================
 * KIZIK AI
 * ----------------------------------------------------------
 * File    : gemini.js
 * Version : 1.0.0
 * Status  : FINAL
 * Author  : Mehmet & ChatGPT
 * Purpose : Gemini model bağlantısını oluşturur.
 * ==========================================================
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {

    console.error("❌ GEMINI_API_KEY bulunamadı.");

    process.exit(1);

}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({

    model: process.env.GEMINI_MODEL || "gemini-2.5-flash"

});

console.log("🤖 Gemini bağlantısı hazır.");

module.exports = {
    model
};