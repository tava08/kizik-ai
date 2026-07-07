const db = require("../config/firebase");

const USERS = "users";

async function getUser(phone) {

    const ref = db.collection(USERS).doc(phone);

    const doc = await ref.get();

    if (!doc.exists) {

        const user = {
            phone,
            createdAt: new Date(),
            updatedAt: new Date(),
            messages: [],
            memory: {}
        };

        await ref.set(user);

        return user;
    }

    return doc.data();
}

module.exports = {
    getUser
};