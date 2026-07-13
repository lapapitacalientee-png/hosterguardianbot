const {
    EmbedBuilder
} = require("discord.js");

const {
    getAverageRating,
    getRatings
} = require("../utils/ratings");

const {
    getRecentClaims
} = require("../utils/history");

function starBar(average) {

    const fullStars = Math.round(average);
    return "⭐".repeat(fullStars) + "☆".repeat(5 - fullStars);

}

module.exports = {

    name: "profile",

    description: "View a hoster's profile, rating, and recent claims.",

    async execute(message, client, args) {

        const target = message.mentions.users.first() || message.author;

        const stats = getAverageRating(target.id);

        const allRatings = getRatings()[target.id] || [];

        const recentClaims = getRecentClaims(target.id, 5);

        const completedCount = recentClaims.filter(c => c.status !== "cancelled").length;
        const cancelledCount = recentClaims.filter(c => c.status === "cancelled").length;

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle(`📇 ${target.username}'s Hoster Profile`)

            .setThumbnail(target.displayAvatarURL())

            .setDescription(`Roleplay hosting stats for ${target}`);

        // Sección de calificación
        if (stats) {

            embed.addFields({
                name: "⭐ Average Rating",
                value:
                    `${starBar(stats.average)} **${stats.average} / 5**\n` +
                    `Based on **${stats.count}** review${stats.count === 1 ? "" : "s"} from other users.`,
                inline: false
            });

            // Muestra el comentario más reciente si existe
            const lastWithComment = [...allRatings].reverse().find(r => r.comment);

            if (lastWithComment) {

                embed.addFields({
                    name: "💬 Latest Feedback",
                    value: `"${lastWithComment.comment}" — *rated ${lastWithComment.value}/5*`,
                    inline: false
                });

            }

        } else {

            embed.addFields({
                name: "⭐ Average Rating",
                value: "This hoster hasn't received any ratings yet.\nUse `!rate @user <1-5>` after their roleplay to leave one!",
                inline: false
            });

        }

        // Sección de estadísticas de claims
        embed.addFields({
            name: "📊 Claim Stats (last 5)",
            value:
                `✅ Completed: **${completedCount}**\n` +
                `❌ Cancelled: **${cancelledCount}**`,
            inline: false
        });

        // Sección de claims recientes
        if (recentClaims.length > 0) {

            const list = recentClaims.map((claim, index) => {

                const date = new Date(claim.created).toLocaleDateString();
                const statusText = claim.status === "cancelled" ? "Cancelled" : "Completed";
                const statusEmoji = claim.status === "cancelled" ? "❌" : "✅";

                return `**${index + 1}.** ${statusEmoji} *${statusText}* — **${claim.topic}**\n　　📅 ${date}`;

            }).join("\n\n");

            embed.addFields({
                name: "🎭 Recent Claims",
                value: list,
                inline: false
            });

        } else {

            embed.addFields({
                name: "🎭 Recent Claims",
                value: "This hoster hasn't hosted any roleplays yet.\nUse `!claim <time> <topic>` to create one!",
                inline: false
            });

        }

        embed

            .setFooter({
                text: "RP Claim System • Use !rate to leave feedback"
            })

            .setTimestamp();

        return message.channel.send({
            embeds: [embed]
        });

    }

};
                
