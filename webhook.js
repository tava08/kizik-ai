const express = require("express");

const router = express.Router();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// GET doğrulama
router.get("/webhook", (req, res) => {

    console.log("GET /webhook");

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {

        console.log("✅ Webhook doğrulandı.");

        return res.status(200).send(challenge);

    }

    console.log("❌ Doğrulama başarısız.");

    res.sendStatus(403);

});


// POST mesajları
router.post("/webhook", async (req, res) => {

    console.log("====================================");
    console.log("📩 Yeni webhook geldi");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("====================================");

    res.sendStatus(200);

});

module.exports = router;