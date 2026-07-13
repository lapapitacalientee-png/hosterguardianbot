const {
    EmbedBuilder
} = require("discord.js");

const {
    getClaims,
    saveClaims,
    parseTime
} = require("../utils/claims");

module.exports = {

    name: "claim",

    async execute(message, client, args) {

        if (!args[0] || args.length < 2) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage: `!claim <time> <topic>`\n\nExample:\n`!claim 5m Vatican Map`"
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

        const claims = getClaims();

        // Prevent multiple claims
        const already = Object.values(claims).find(
            c => c.userID === message.author.id
        );

        if (already) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Orange")
                        .setTitle("⚠️ Active Claim")
                        .setDescription(
                            "You already have an active claim.\nUse `!cancelclaim` first."
                        )
                ]
            });

        }

        const topic = args.slice(1).join(" ");

        const expire = Date.now() + duration;

        const id = Date.now().toString();

        const claim = claims[id] = {

            userID: message.author.id,

            username: message.author.tag,

            topic,

            created: new Date().toISOString(),

            expires: expire,

            reminded: false,

            reminded2h: false

        };

        await message.delete().catch(() => {});

        const embed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("📌 New RP Claim")

            .setThumbnail(
                message.author.displayAvatarURL()
            )

            .addFields(

                {
                    name: "👤 Hoster",
                    value: `${message.author}`,
                    inline: false
                },

                {
                    name: "🎭 Roleplay Will be Hosted:",
                    value: topic,
                    inline: false
                },

                {
                    name: "🕒 Roleplay Start:",
                    value: `<t:${Math.floor(expire / 1000)}:R>`,
                    inline: false
                }

            )

            .setFooter({
                text: "RP Claim System"
            })

            .setTimestamp();

        const sentMessage = await message.channel.send({
            embeds: [embed]
        });

        claim.messageID = sentMessage.id;
        claim.channelID = sentMessage.channel.id;

        saveClaims(claims);

    }

};
