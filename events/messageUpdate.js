const { EmbedBuilder } = require("discord.js");
const { getConfig } = require("../utils/config");

module.exports = (client) => {

    client.on("messageUpdate", async (oldMessage, newMessage) => {

        if (!oldMessage.guild) return;
        if (oldMessage.author?.bot) return;

        // Ignore if only embeds/attachments changed
        if (oldMessage.content === newMessage.content) return;


        const config = getConfig();

        if (!config.logChannel) return;


        const logChannel = client.channels.cache.get(
            config.logChannel
        );

        if (!logChannel) return;


        const embed = new EmbedBuilder()
            .setTitle("✏️ Message Edited")
            .setColor("Yellow")
            .addFields(
                {
                    name: "👤 User",
                    value: `${oldMessage.author || "Unknown"}\n\`${oldMessage.author?.id || "Unknown"}\``
                },
                {
                    name: "📍 Channel",
                    value: `${oldMessage.channel}`
                },
                {
                    name: "⬅️ Before",
                    value: oldMessage.content
                        ? oldMessage.content.slice(0, 1024)
                        : "No content"
                },
                {
                    name: "➡️ After",
                    value: newMessage.content
                        ? newMessage.content.slice(0, 1024)
                        : "No content"
                },
                {
                    name: "🆔 Message ID",
                    value: oldMessage.id
                }
            )
            .setThumbnail(
                oldMessage.author?.displayAvatarURL({
                    dynamic: true
                })
            )
            .setTimestamp()
            .setFooter({
                text: "HosterGuardian Logs"
            });


        // If the edited message contains an image
        const image = newMessage.attachments.first();

        if (image) {
            embed.setImage(image.url);
        }


        logChannel.send({
            embeds: [embed]
        });

    });

};
