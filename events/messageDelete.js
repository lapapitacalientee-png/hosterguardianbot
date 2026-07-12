const { EmbedBuilder } = require("discord.js");
const { getConfig } = require("../utils/config");

module.exports = (client) => {

    client.on("messageDelete", async (message) => {

        if (!message.guild) return;
        if (message.author?.bot) return;


        const config = getConfig();

        if (!config.logChannel) return;


        const logChannel = client.channels.cache.get(
            config.logChannel
        );

        if (!logChannel) return;


        const embed = new EmbedBuilder()
            .setTitle("🗑️ Message Deleted")
            .setColor("Red")
            .addFields(
                {
                    name: "👤 User",
                    value: `${message.author || "Unknown"}\n\`${message.author?.id || "Unknown"}\``
                },
                {
                    name: "📍 Channel",
                    value: `${message.channel}`
                },
                {
                    name: "💬 Content",
                    value: message.content
                        ? message.content.slice(0, 1024)
                        : "No text content"
                },
                {
                    name: "📎 Attachments",
                    value: message.attachments.size
                        ? `${message.attachments.size} file(s)`
                        : "None"
                },
                {
                    name: "🆔 Message ID",
                    value: message.id
                }
            )
            .setThumbnail(
                message.author?.displayAvatarURL({
                    dynamic: true
                })
            )
            .setTimestamp()
            .setFooter({
                text: "HosterGuardian Logs"
            });


        // If the deleted message contained an image
        const image = message.attachments.first();

        if (image) {

            embed.setImage(image.url);

        }


        logChannel.send({
            embeds: [embed]
        });

    });

};
