const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField
} = require("discord.js");

module.exports = {

    name: "hosterverify",

    description: "Post the hoster verification panel (Administrator only).",

    async execute(message) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Permission Denied")
                        .setDescription("Only Administrators can use this command.")
                ]
            });

        }

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle("📋 Hoster Verification")

            .setDescription(
                "Click the button below to start your hoster verification form.\n\n" +
                "You'll receive a short questionnaire in your **DMs** about your hosting/moderation experience. Make sure your DMs are open!"
            )

            .setFooter({
                text: "RP Claim System"
            });

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("start_hoster_verify")
                .setLabel("Verify")
                .setStyle(ButtonStyle.Success)
                .setEmoji("✅")

        );

        return message.channel.send({
            embeds: [embed],
            components: [row]
        });

    }

};
