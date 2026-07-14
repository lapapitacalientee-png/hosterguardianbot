const fs = require("fs");
const path = require("path");

const afkPath = path.join(__dirname, "../afk.json");

function getAfkList() {
    if (!fs.existsSync(afkPath)) {
        fs.writeFileSync(afkPath, JSON.stringify({}));
    }
    const data = fs.readFileSync(afkPath, "utf8");
    return JSON.parse(data);
}

function saveAfkList(data) {
    fs.writeFileSync(afkPath, JSON.stringify(data, null, 2));
}

function setAfk(userID, reason, originalNickname) {

    const data = getAfkList();

    data[userID] = {
        reason: reason || "AFK",
        since: Date.now(),
        originalNickname: originalNickname || null
    };

    saveAfkList(data);

}

function removeAfk(userID) {

    const data = getAfkList();

    const entry = data[userID] || null;

    delete data[userID];

    saveAfkList(data);

    return entry;

}

function getAfk(userID) {

    const data = getAfkList();
    return data[userID] || null;

}

module.exports = {
    getAfkList,
    saveAfkList,
    setAfk,
    removeAfk,
    getAfk
};
