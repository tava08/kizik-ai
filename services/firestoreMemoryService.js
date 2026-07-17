const db = require("../config/firebase");

const USERS = "kullanıcılar";

/**
 * Kullanıcıyı getir.
 * Yoksa oluştur.
 */
async function getUser(phone) {

    const ref = db.collection(USERS).doc(phone);

    const doc = await ref.get();

    if (!doc.exists) {

        const user = {
            phone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
            memory: {}
        };

        await ref.set(user);

        return user;
    }

    return doc.data();

}

/**
 * Mesajı Firestore'a kaydet
 */
/**
 * Mesajı Firestore'a kaydet
 */
async function saveMessage(phone, role, text) {

    const userRef = db.collection(USERS).doc(phone);

    const doc = await userRef.get();

    if (!doc.exists) {
        await getUser(phone);
    }

    await userRef.collection("messages").add({

        role,
        text,
        createdAt: new Date().toISOString()

    });

    await userRef.update({

        updatedAt: new Date().toISOString()

    });

}

/**
 * Hafızaya bilgi kaydet
 */
async function remember(phone, key, value) {

    const ref = db.collection(USERS).doc(phone);

    await ref.set({

        memory: {
            [key]: value
        },

        updatedAt: new Date().toISOString()

    }, { merge: true });

}

module.exports = {
    getUser,
    saveMessage,
    remember
};