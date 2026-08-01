const axios = require("axios");

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

/**
 * WhatsApp mesajı gönderir.
 * @param {string} to Kullanıcının telefon numarası
 * @param {string} message Gönderilecek mesaj
 */
async function sendText(to, message) {

    try {

        await axios.post(

            `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,

            {
                messaging_product: "whatsapp",

                to: to,

                type: "text",

                text: {
                    body: message
                }

            },

            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }

        );

        console.log("✅ WhatsApp mesajı gönderildi.");

    } catch (error) {

        console.error("❌ WhatsApp Hatası");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

    }

}

module.exports = {
     sendText
};