const fs = require("fs");
const path = require("path");

const historyPath = path.join(__dirname, "../history.json");

function getHistory() {
    if (!fs.existsSync(historyPath)) {
        fs.writeFileSync(historyPath, JSON.stringify({}));
    }
    const data = fs.readFileSync(historyPath, "utf8");
    return JSON.parse(data);
}

function saveHistory(history) {
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

// Agrega un claim finalizado (expirado o cancelado) al historial del hoster
function addToHistory(claim, status) {

    const history = getHistory();

    if (!history[claim.userID]) {
        history[claim.userID] = [];
    }

    history[claim.userID].unshift({
        topic: claim.topic,
        created: claim.created,
        status: status || "completed" // "completed" o "cancelled"
    });

    // Mantiene solo los últimos 10 por usuario para no crecer sin límite
    history[claim.userID] = history[claim.userID].slice(0, 10);

    saveHistory(history);

}

// Devuelve los últimos N claims de un hoster
function getRecentClaims(userID, limit = 5) {

    const history = getHistory();
    const userHistory = history[userID] || [];

    return userHistory.slice(0, limit);

}

module.exports = {
    getHistory,
    saveHistory,
    addToHistory,
    getRecentClaims
};
