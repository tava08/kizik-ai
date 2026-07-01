/**
 * ==========================================================
 * KIZIK AI
 * ----------------------------------------------------------
 * File    : whatsappService.js
 * Version : 1.0.0
 * Status  : FINAL
 * Author  : Mehmet & ChatGPT
 * Purpose : WhatsApp Cloud API ile mesaj gönderme işlemleri.
 * ==========================================================
 */

const axios = require("axios");

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

const GRAPH_API = `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`;

/**
 * Ortak WhatsApp isteği gönderir.
 * @param {Object} payload
 */
async function send(payload) {

    try {

        await axios.post(

            GRAPH_API,

            payload,

            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }

        );

        console.log("✅ WhatsApp mesajı gönderildi.");

    } catch (error) {

        console.error("❌ WhatsApp API Hatası");

        if (error.response) {

            console.error(error.response.data);

        } else {

            console.error(error.message);

        }

    }

}

/**
 * Yazı mesajı gönderir.
 * @param {string} to
 * @param {string} message
 */
async function sendText(to, message) {

    await send({

        messaging_product: "whatsapp",

        to,

        type: "text",

        text: {
            body: message
        }

    });

}

/**
 * Gelecekte eklenecek servisler
 */

async function sendImage() {

    throw new Error("Henüz geliştirilmedi.");

}

async function sendDocument() {

    throw new Error("Henüz geliştirilmedi.");

}

async function sendAudio() {

    throw new Error("Henüz geliştirilmedi.");

}

async function sendLocation() {

    throw new Error("Henüz geliştirilmedi.");

}

module.exports = {

    sendText,

    sendImage,

    sendDocument,

    sendAudio,

    sendLocation

};