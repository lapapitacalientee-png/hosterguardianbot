const { EmbedBuilder } = require("discord.js");
const { getClaims } = require("../utils/claims");


module.exports = {
    name: "currentclaims",

    async execute(message) {


        const claims = getClaims();


        if (!claims.length) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("📋 Current Claims")
                    .setColor("Grey")
                    .setDescription(
                        "There are currently no active claims."
                    )
                    .setTimestamp()
                ]
            });

        }



        const activeClaims = claims.filter(
            claim => claim.expires > Date.now()
        );



        if (!activeClaims.length) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("📋 Current Claims")
                    .setColor("Grey")
                    .setDescription(
                        "There are currently no active claims."
                    )
                    .setTimestamp()
                ]
            });

        }



        const embed = new EmbedBuilder()
            .setTitle("📋 Current Claims")
            .setColor("Blue")
            .setDescription(
                "Here are all currently active hosting claims."
            )
            .setTimestamp()
            .setFooter({
                text: "HosterGuardian Claims"
            });



        activeClaims.forEach((claim, index) => {

            embed.addFields({

                name: `🎮 Claim #${index + 1}`,

                value:
                `👤 **Host:** <@${claim.userId}>\n` +
                `🎯 **Hosting:** ${claim.reason || "Unknown"}\n` +
                `⏳ **Remaining:** <t:${Math.floor(claim.expires / 1000)}:R>`

            });

        });



        message.reply({

            embeds: [embed]

        });


    }
};
