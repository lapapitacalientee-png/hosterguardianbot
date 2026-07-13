const fs = require("fs");
const path = require("path");

const claimsPath = path.join(__dirname, "../claims.json");

function getClaims() {
    if (!fs.existsSync(claimsPath)) {
        fs.writeFileSync(claimsPath, JSON.stringify({}));
    }
    const data = fs.readFileSync(claimsPath, "utf8");
    return JSON.parse(data);
}

function saveClaims(claims) {
    fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2));
}

// Convierte "5m", "2h", "1d" a milisegundos
function parseTime(input) {
    const match = input.match(/^(\d+)(m|h|d)$/);
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    let ms;
    if (unit === "m") {
        if (value < 1 || value > 59) return null;
        ms = value * 60 * 1000;
    } else if (unit === "h") {
        if (value < 1 || value > 24) return null;
        ms = value * 60 * 60 * 1000;
    } else if (unit === "d") {
        if (value < 1 || value > 30) return null;
        ms = value * 24 * 60 * 60 * 1000;
    }

    return ms;
}

// Elimina claims cuyo tiempo ya expiró
function cleanOldClaims() {
    const claims = getClaims();
    let changed = false;

    for (const id in claims) {
        if (claims[id].expires && claims[id].expires < Date.now()) {
            delete claims[id];
            changed = true;
        }
    }

    if (changed) saveClaims(claims);
}

module.exports = {
    getClaims,
    saveClaims,
    parseTime,
    cleanOldClaims
};
