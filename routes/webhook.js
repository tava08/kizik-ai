/**
 * ==========================================================
 * KIZIK AI
 * ----------------------------------------------------------
 * File    : webhook.js
 * Version : 1.0.0
 * Status  : FINAL
 * Author  : Mehmet & ChatGPT
 * Purpose : Meta Webhook isteklerini yönetir.
 * ==========================================================
 */

const express = require("express");

const router = express.Router();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const { askAI } = require("../services/aiService");
const { sendText } = require("../services/whatsappService");
const memory = require("../services/firestoreMemoryService");

router.get("/webhook", (req, res) => {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {

        console.log("✅ Webhook doğrulandı.");

        return res.status(200).send(challenge);

    }

    console.log("❌ Webhook doğrulama başarısız.");

    return res.sendStatus(403);

});


/**
 * WhatsApp Mesajları
 */
router.post("/webhook", async (req, res) => {

    try {

        const message =
            req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

        if (!message) {
            return res.sendStatus(200);
        }

        // Şimdilik sadece yazı mesajlarını işle
        if (message.type !== "text") {

            console.log("ℹ Desteklenmeyen mesaj tipi :", message.type);

            return res.sendStatus(200);

        }
        const messageId = message.id;
        const from = message.from;
        await memory.getUser(from);
        const text = message.text.body;

        // Kullanıcıyı hafızadan al
        const user = memory.getUser(from);

        // Mesajı hafızaya kaydet
        //memory.saveMessage(from, text);;

        console.log("");
        console.log("========================================");
        console.log("📩 Yeni WhatsApp Mesajı");
        console.log("----------------------------------------");
        console.log("👤 Telefon :", from);
        console.log("💬 Mesaj   :", text);
        console.log("========================================");
        console.log("🆔 Mesaj ID :", messageId);
        console.time("Gemini");

        const answer = await askAI(text);

        console.timeEnd("Gemini");

        if (!answer) {

            console.log("⚠ Gemini cevap üretmedi.");

            return res.sendStatus(200);

        }

        console.log("🤖 AI Cevabı");

        console.log(answer);

        await sendText(from, answer);

        console.log("✅ Cevap gönderildi.");

        return res.sendStatus(200);

    } catch (error) {

        console.error("");
        console.error("❌ WEBHOOK HATASI");
        console.error(error);

        // Meta'nın aynı mesajı tekrar göndermemesi için
        return res.sendStatus(200);

    }

});

module.exports = router;