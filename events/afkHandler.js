const { EmbedBuilder } = require("discord.js");

const {
    getAfk,
    removeAfk
} = require("../utils/afk");

function timeAgo(timestamp) {

    const diffMs = Date.now() - timestamp;
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) return "just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    return days === 1 ? "1 day ago" : `${days} days ago`;

}

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;
        if (!message.guild) return;

        // 1. Si el autor estaba AFK, lo remueve (a menos que sea el mismo comando !afk)
        const isAfkCommand = message.content.trim().toLowerCase().startsWith("!afk");

        if (!isAfkCommand) {

            const afkEntry = getAfk(message.author.id);

            if (afkEntry) {

                removeAfk(message.author.id);

                // Restaura el apodo original si el bot pudo cambiarlo
                try {

                    await message.member.setNickname(afkEntry.originalNickname || null);

                } catch (err) {
                    // Sin permiso o dueño del server, lo ignora
                }

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("👋 Welcome Back")
                    .setDescription(`${message.author}, I removed your AFK status.`)
                    .setTimestamp();

                message.channel.send({ embeds: [embed] })
                    .then(msg => setTimeout(() => msg.delete().catch(() => {}), 8000))
                    .catch(() => {});

            }

        }

        // 2. Si el mensaje menciona a alguien que está AFK, avisa
        if (message.mentions.users.size > 0) {

            for (const [, user] of message.mentions.users) {

                const afkEntry = getAfk(user.id);

                if (afkEntry) {

                    const embed = new EmbedBuilder()
                        .setColor("Orange")
                        .setTitle("💤 User is AFK")
                        .setDescription(
                            `${user.username} is AFK: **${afkEntry.reason}**\n*(${timeAgo(afkEntry.since)})*`
                        );

                    message.reply({ embeds: [embed] }).catch(() => {});

                }

            }

        }

    });

};
                  
