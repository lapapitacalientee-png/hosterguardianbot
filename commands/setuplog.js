const { getConfig, saveConfig } = require("../utils/config");

module.exports = {
    name: "setuplog",

    async execute(message) {

        const channel = message.mentions.channels.first();

        if (!channel) {
            return message.reply(
                "❌ Mention a channel. Example: `;setuplog #logs`"
            );
        }

        const config = getConfig();

        config.logChannel = channel.id;

        saveConfig(config);

        message.reply(
            `✅ Log channel set: ${channel}`
        );
    }
};
