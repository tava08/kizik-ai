/**
 * ==========================================================
 * KIZIK AI
 * ----------------------------------------------------------
 * File    : aiService.js
 * Version : 1.0.0
 * Status  : FINAL
 * Author  : Mehmet & ChatGPT
 * Purpose : Gemini'den cevap üretir.
 * ==========================================================
 */

const { model } = require("../config/gemini");
const systemPrompt = require("../prompts/systemPrompt");
if (!userMessage || !userMessage.trim()) {

    return "Lütfen bir mesaj yaz.";

}
function buildPrompt(userMessage) {

    return `
${systemPrompt}

KULLANICI

${userMessage}
`;

}

async function askAI(userMessage) {

    if (!userMessage || !userMessage.trim()) {
        return "Lütfen bir mesaj yaz.";
    }

    try {

        const prompt = buildPrompt(userMessage);

        console.log("🤖 Gemini cevap oluşturuyor...");

        const result = await model.generateContent(prompt);

        const response = await result.response;

        const text = response.text();

        console.log("✅ Gemini cevap oluşturdu.");

        if (!text) {
            return "Üzgünüm Mehmet, cevap oluşturamadım.";
        }

        return text;

    } catch (error) {

        console.error("❌ Gemini Hatası");
        console.error(error);

        return "Üzgünüm Mehmet, şu anda cevap veremiyorum.";
    }
}

        return text;

    } catch (error) {

        console.error("❌ Gemini Hatası");

        console.error(error);

        return "Üzgünüm Mehmet, şu anda cevap veremiyorum.";

    }

}

module.exports = {
    askAI
};