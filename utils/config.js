const fs = require("fs");

function getConfig() {
    return JSON.parse(
        fs.readFileSync("./config.json", "utf8")
    );
}

function saveConfig(config) {
    fs.writeFileSync(
        "./config.json",
        JSON.stringify(config, null, 2)
    );
}

module.exports = {
    getConfig,
    saveConfig
};
