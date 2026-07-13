const {
    EmbedBuilder
} = require("discord.js");

const {
    getAverageRating
} = require("../utils/ratings");

const {
    getRecentClaims
} = require("../utils/history");

function starBar(average) {

    if (average === null) return "No ratings yet";

    const fullStars = Math.round(average);
    const stars = "⭐".repeat(fullStars) + "☆".repeat(5 - fullStars);

    return `${stars} (${average}/5)`;

}

module.exports = {

    name: "profile",

    description: "View a hoster's profile, rating, and recent claims.",

    async execute(message, client, args) {

        const target = message.mentions.users.first() || message.author;

        const stats = getAverageRating(target.id);

        const recentClaims = getRecentClaims(target.id, 5);

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle(`📇 ${target.username}'s Profile`)

            .setThumbnail(target.displayAvatarURL())

            .addFields(

                {
                    name: "⭐ Rating",
                    value: stats
                        ? `${starBar(stats.average)}\n${stats.count} rating${stats.count === 1 ? "" : "s"}`
                        : "No ratings yet",
                    inline: false
                }

            )

            .setFooter({
                text: "RP Claim System"
            })

            .setTimestamp();

        if (recentClaims.length > 0) {

            const list = recentClaims.map((claim, index) => {

                const date = new Date(claim.created).toLocaleDateString();
                const statusEmoji = claim.status === "cancelled" ? "❌" : "✅";

                return `${statusEmoji} **${claim.topic}** — ${date}`;

            }).join("\n");

            embed.addFields({
                name: "🎭 Recent Claims",
                value: list
            });

        } else {

            embed.addFields({
                name: "🎭 Recent Claims",
                value: "No claims yet."
            });

        }

        return message.channel.send({
            embeds: [embed]
        });

    }

};
