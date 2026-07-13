const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const { addToHistory } = require("./history");

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

// Revisa claims cuyo tiempo ya terminó: borra el mensaje y avisa por DM
async function checkExpiredClaims(client) {

    const claims = getClaims();
    let changed = false;

    for (const id in claims) {

        const claim = claims[id];

        if (!claim.reminded && claim.expires <= Date.now()) {

            // Guarda el claim en el historial del hoster antes de borrarlo
            addToHistory(claim, "completed");

            // Intenta borrar el mensaje del claim en el canal
            try {

                const channel = await client.channels.fetch(claim.channelID);
                const msg = await channel.messages.fetch(claim.messageID);

                if (msg) await msg.delete().catch(() => {});

            } catch (err) {
                // El mensaje ya no existe o no se pudo obtener, no pasa nada
            }

            // Envía confirmación por DM al usuario
            try {

                const user = await client.users.fetch(claim.userID);

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Claim Message Deleted")
                    .setDescription(
                        "Your claim message has been successfully deleted.\n\nDon't forget to save your roleplay in your portfolio!"
                    )
                    .setTimestamp();

                await user.send({ embeds: [embed] }).catch(() => {});

            } catch (err) {
                console.log(`Could not DM user ${claim.userID}:`, err.message);
            }

            claim.reminded = true;
            changed = true;

        }

    }

    if (changed) saveClaims(claims);

}

module.exports = {
    getClaims,
    saveClaims,
    parseTime,
    cleanOldClaims,
    checkExpiredClaims
};
                                                  
