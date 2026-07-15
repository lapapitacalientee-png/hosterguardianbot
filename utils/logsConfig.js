const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../logsConfig.json");

function getLogConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({}));
    }
    const data = fs.readFileSync(configPath, "utf8");
    return JSON.parse(data);
}

function saveLogConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

// Guarda el canal de logs para un servidor específico
function setLogChannel(guildID, channelID) {

    const config = getLogConfig();

    config[guildID] = channelID;

    saveLogConfig(config);

}

// Devuelve el canal de logs de un servidor (o null si no está configurado)
function getLogChannel(guildID) {

    const config = getLogConfig();

    return config[guildID] || null;

}

// Removes the saved log channel for a specific server
function clearLogChannel(guildID) {

    const config = getLogConfig();

    delete config[guildID];

    saveLogConfig(config);

}

module.exports = {
    getLogConfig,
    saveLogConfig,
    setLogChannel,
    getLogChannel,
    clearLogChannel
};
