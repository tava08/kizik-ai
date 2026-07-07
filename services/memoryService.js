const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "../memory/users.json");

function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, "{}");
        }

        return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    } catch (err) {
        console.error("Memory okunamadı:", err);
        return {};
    }
}

function saveUsers(users) {
    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users, null, 2),
        "utf8"
    );
}

function getUser(phone) {
    const users = loadUsers();

    if (!users[phone]) {
        users[phone] = {
            phone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
            memory: {}
        };

        saveUsers(users);
    }

    return users[phone];
}

function saveMessage(phone, message) {
    const users = loadUsers();

    if (!users[phone]) {
        getUser(phone);
        return saveMessage(phone, message);
    }

    users[phone].messages.push({
        text: message,
        date: new Date().toISOString()
    });

    if (users[phone].messages.length > 20) {
        users[phone].messages.shift();
    }

    users[phone].updatedAt = new Date().toISOString();

    saveUsers(users);
}

function remember(phone, key, value) {
    const users = loadUsers();

    if (!users[phone]) {
        getUser(phone);
    }

    users[phone].memory[key] = value;
    users[phone].updatedAt = new Date().toISOString();

    saveUsers(users);
}

module.exports = {
    getUser,
    saveMessage,
    remember
};