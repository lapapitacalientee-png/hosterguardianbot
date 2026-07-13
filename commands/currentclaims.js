const {
    EmbedBuilder
} = require("discord.js");

const {
    getClaims,
    cleanOldClaims
} = require("../utils/claims");

module.exports = {

    name: "currentclaims",

    async execute(message) {

        cleanOldClaims();

        const claims = getClaims();

        const list = Object.values(claims);

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle("📋 Current RP Claims")

            .setDescription(
                list.length
                ? "These roleplays are currently claimed."
                : "There are no active claims."
            )

            .setTimestamp()

            .setFooter({
                text: "RP Claim System"
            });

        if (list.length > 0) {

            list.forEach((claim, index) => {

                embed.addFields({

                    name: `#${index + 1} • ${claim.topic}`,

                    value:
                        `👤 **Hoster:** <@${claim.userID}>\n` +
                        `🕒 **Roleplay Start:** <t:${Math.floor(claim.expires / 1000)}:R>`,

                    inline: false

                });

            });

        }

        return message.channel.send({
            embeds: [embed]
        });

    }

};
