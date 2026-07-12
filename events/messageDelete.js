const { getConfig } = require("../utils/config");

module.exports = (client) => {

    client.on("messageDelete", async (message) => {

        if (!message.guild) return;

        const config = getConfig();

        if (!config.logChannel) return;

        const logChannel = client.channels.cache.get(
            config.logChannel
        );

        if (!logChannel) return;

        logChannel.send(
            `🗑️ **Message Deleted**\n\n` +
            `👤 User: ${message.author || "Unknown"}\n` +
            `📍 Channel: ${message.channel}\n` +
            `💬 Content:\n${message.content || "No content"}`
        );

    });

};
