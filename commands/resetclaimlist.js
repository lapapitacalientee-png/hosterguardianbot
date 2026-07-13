const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const {
    saveClaims
} = require("../utils/claims");

module.exports = {

    name: "resetclaimlist",

    async execute(message) {

        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                    .setColor("Red")

                    .setTitle("❌ No Permission")

                    .setDescription(
                        "You need Administrator permission to use this command."
                    )

                ]

            });

        }

        saveClaims({});

        await message.delete().catch(() => {});

        const embed = new EmbedBuilder()

            .setColor("Red")

            .setTitle("🗑️ Claim List Reset")

            .setDescription(
                "All active roleplay claims have been removed."
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
