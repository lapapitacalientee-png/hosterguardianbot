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

module.exports = {
    getClaims,
    saveClaims
};
