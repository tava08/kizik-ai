/**
 * ==========================================================
 * KIZIK AI
 * ==========================================================
 */

const { model } = require("../config/gemini");
const systemPrompt = require("../src/application/prompts/systemPrompt");

function buildPrompt(userMessage, history = "") {
    return `
${systemPrompt}

KULLANICI

${userMessage}
`;
}

async function askAI(userMessage, history = "") {

    if (!userMessage || !userMessage.trim()) {

       return `
${systemPrompt}

GEÇMİŞ KONUŞMALAR

${history}

KULLANICI

${userMessage}
`;
    }  

    try {

        const prompt = buildPrompt(userMessage, history);

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

module.exports = {
    askAI
};