const {
    EmbedBuilder
} = require("discord.js");

const {
    getClaims,
    saveClaims
} = require("../utils/claims");

const {
    addToHistory
} = require("../utils/history");

module.exports = {

    name: "cancelclaim",

    description: "Cancel your active claim.",

    async execute(message) {

        const claims = getClaims();

        let claimFound = false;

        for (const id in claims) {

            if (claims[id].userID === message.author.id) {

                addToHistory(claims[id], "cancelled");

                delete claims[id];

                claimFound = true;

                break;

            }

        }

        if (!claimFound) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                    .setColor("Red")

                    .setTitle("❌ No Active Claim")

                    .setDescription(
                        "You don't have an active claim to cancel."
                    )

                ]

            });

        }

        saveClaims(claims);

        await message.delete().catch(() => {});

        const embed = new EmbedBuilder()

            .setColor("Orange")

            .setTitle("✅ Claim Cancelled")

            .setDescription(
                "Your roleplay claim has been cancelled and removed from the claim list."
            )

            .setTimestamp()

            .setFooter({
                text: "RP Claim System"
            });

        return message.channel.send({
            embeds: [embed]
        });

    }

};
