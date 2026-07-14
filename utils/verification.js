const fs = require("fs");
const path = require("path");

const verificationPath = path.join(__dirname, "../verifications.json");

function getVerifications() {
    if (!fs.existsSync(verificationPath)) {
        fs.writeFileSync(verificationPath, JSON.stringify({}));
    }
    const data = fs.readFileSync(verificationPath, "utf8");
    return JSON.parse(data);
}

function saveVerifications(data) {
    fs.writeFileSync(verificationPath, JSON.stringify(data, null, 2));
}

// Guarda las respuestas de un usuario tras completar el formulario
function setAnswers(userID, guildID, answers) {

    const data = getVerifications();

    data[userID] = {
        guildID,
        answers,
        status: "pending",
        submittedAt: new Date().toISOString(),
        note: null
    };

    saveVerifications(data);

}

// Actualiza el estado (approved/denied) y nota opcional
function setStatus(userID, status, note) {

    const data = getVerifications();

    if (!data[userID]) {
        data[userID] = { answers: [], guildID: null, submittedAt: null };
    }

    data[userID].status = status;
    data[userID].note = note || null;
    data[userID].reviewedAt = new Date().toISOString();

    saveVerifications(data);

}

function getVerification(userID) {

    const data = getVerifications();
    return data[userID] || null;

}

module.exports = {
    getVerifications,
    saveVerifications,
    setAnswers,
    setStatus,
    getVerification
};
