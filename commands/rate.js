const {
    EmbedBuilder
} = require("discord.js");

const {
    addRating,
    getAverageRating
} = require("../utils/ratings");

module.exports = {

    name: "rate",

    description: "Rate a hoster's roleplay (1.0 - 5.0).",

    async execute(message, client, args) {

        const target = message.mentions.users.first();

        if (!target || !args[1]) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage: `!rate @hoster <1.0-5.0> [comment]`\n\nExample:\n`!rate @Hoster 4.5 Great pacing!`"
                        )
                ]
            });

        }

        if (target.bot) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Target")
                        .setDescription("You can't rate a bot.")
                ]
            });

        }

        if (target.id === message.author.id) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Target")
                        .setDescription("You can't rate yourself.")
                ]
            });

        }

        const value = parseFloat(args[1]);

        if (isNaN(value) || value < 1 || value > 5) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Rating")
                        .setDescription(
                            "Rating must be a number between `1.0` and `5.0`.\n\nExamples: `1.2`, `2.9`, `4.5`, `5`"
                        )
                ]
            });

        }

        // Redondea a 1 decimal para mantener consistencia (ej. 4.567 -> 4.6)
        const roundedValue = Math.round(value * 10) / 10;

        const comment = args.slice(2).join(" ");

        addRating(target.id, message.author.id, roundedValue, comment);

        const stats = getAverageRating(target.id);

        const embed = new EmbedBuilder()

            .setColor("Gold")

            .setTitle("⭐ Rating Submitted")

            .setThumbnail(target.displayAvatarURL())

            .addFields(

                {
                    name: "👤 Hoster",
                    value: `${target}`,
                    inline: true
                },

                {
                    name: "⭐ Your Rating",
                    value: `${roundedValue} / 5`,
                    inline: true
                },

                {
                    name: "📊 New Average",
                    value: `${stats.average} / 5 (${stats.count} rating${stats.count === 1 ? "" : "s"})`,
                    inline: true
                }

            )

            .setFooter({
                text: `Rated by ${message.author.tag}`
            })

            .setTimestamp();

        if (comment) {

            embed.addFields({
                name: "💬 Comment",
                value: comment
            });

        }

        return message.channel.send({
            embeds: [embed]
        });

    }

};
