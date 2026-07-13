const {
    EmbedBuilder
} = require("discord.js");

module.exports = {

    name: "help",

    async execute(message) {

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle("📚 RP Claim System - Commands")

            .setDescription(
                "Here are all available claim commands:"
            )

            .addFields(

                {
                    name: "📌 !claim",
                    value: "Create a new roleplay claim."
                },

                {
                    name: "📋 !currentclaims",
                    value: "View all active roleplay claims."
                },

                {
                    name: "❌ !cancelclaim",
                    value: "Cancel your active claim."
                },

                {
                    name: "🗑️ !resetclaimlist",
                    value: "Reset all active claims (Administrator only)."
                }

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
