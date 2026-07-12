const { getConfig } = require("../utils/config");

module.exports = (client) => {

    client.on("messageUpdate", async (oldMessage, newMessage) => {

        if (!oldMessage.guild) return;

        if (oldMessage.content === newMessage.content) return;


        const config = getConfig();

        if (!config.logChannel) return;


        const logChannel = client.channels.cache.get(
            config.logChannel
        );

        if (!logChannel) return;


        logChannel.send(
            `✏️ **Message Edited**\n\n` +
            `👤 User: ${oldMessage.author || "Unknown"}\n` +
            `📍 Channel: ${oldMessage.channel}\n\n` +
            `**Before:**\n${oldMessage.content || "No content"}\n\n` +
            `**After:**\n${newMessage.content || "No content"}`
        );

    });

};
