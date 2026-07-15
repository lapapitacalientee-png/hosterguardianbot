const {
    EmbedBuilder
} = require("discord.js");

const {
    parseTime
} = require("../utils/claims");

module.exports = {

    name: "createcountdown",

    description: "Create a countdown using Discord's live timestamp.",

    async execute(message, client, args) {

        if (!args[0]) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage: `!createcountdown <time> [label]`\n\n" +
                            "**Supported formats:**\n`1m-59m`\n`1h-24h`\n`1d-30d`\n\n" +
                            "Example:\n`!createcountdown 6d Season Finale`"
                        )
                ]
            });

        }

        const duration = parseTime(args[0]);

        if (!duration) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Time")
                        .setDescription(
                            "**Supported formats:**\n`1m-59m`\n`1h-24h`\n`1d-30d`"
                        )
                ]
            });

        }

        const label = args.slice(1).join(" ") || "Countdown";

        const expire = Date.now() + duration;
        const unix = Math.floor(expire / 1000);

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle("⏳ Countdown Created")

            .setDescription(
                `**${label}**\n\n` +
                `⏳ <t:${unix}:R>\n` +
                `📅 <t:${unix}:F>`
            )

            .setFooter({
                text: `Created by ${message.author.tag}`
            });

        await message.delete().catch(() => {});

        return message.channel.send({
            embeds: [embed]
        });

    }

};
