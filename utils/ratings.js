const fs = require("fs");
const path = require("path");

const ratingsPath = path.join(__dirname, "../ratings.json");

function getRatings() {
    if (!fs.existsSync(ratingsPath)) {
        fs.writeFileSync(ratingsPath, JSON.stringify({}));
    }
    const data = fs.readFileSync(ratingsPath, "utf8");
    return JSON.parse(data);
}

function saveRatings(ratings) {
    fs.writeFileSync(ratingsPath, JSON.stringify(ratings, null, 2));
}

// Agrega una calificación al hoster
function addRating(hosterID, raterID, value, comment) {

    const ratings = getRatings();

    if (!ratings[hosterID]) {
        ratings[hosterID] = [];
    }

    ratings[hosterID].push({
        raterID,
        value,
        comment: comment || null,
        timestamp: new Date().toISOString()
    });

    saveRatings(ratings);

}

// Calcula el promedio de calificaciones de un hoster
function getAverageRating(hosterID) {

    const ratings = getRatings();
    const hosterRatings = ratings[hosterID];

    if (!hosterRatings || hosterRatings.length === 0) {
        return null;
    }

    const sum = hosterRatings.reduce((acc, r) => acc + r.value, 0);
    const average = sum / hosterRatings.length;

    return {
        average: Math.round(average * 10) / 10,
        count: hosterRatings.length
    };

}

// Revisa si un usuario ya calificó a un hoster (opcional, evita spam de rates)
function hasRated(hosterID, raterID) {

    const ratings = getRatings();
    const hosterRatings = ratings[hosterID];

    if (!hosterRatings) return false;

    return hosterRatings.some(r => r.raterID === raterID);

}

module.exports = {
    getRatings,
    saveRatings,
    addRating,
    getAverageRating,
    hasRated
};
