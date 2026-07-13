const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

const {
    setLogChannel
} = require("../utils/logsConfig");

module.exports = {

    name: "setupbotlogs",

    description: "Set the channel where command logs are sent (Administrator only).",

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

        const channel = message.mentions.channels.first();

        if (!channel) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage: `!setupbotlogs #channel`\n\nExample:\n`!setupbotlogs #bot-logs`"
                        )
                ]
            });

        }

        setLogChannel(message.guild.id, channel.id);

        const embed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("✅ Bot Logs Configured")

            .setDescription(`All command usage will now be logged in ${channel}.`)

            .setFooter({
                text: "RP Claim System"
            })

            .setTimestamp();

        return message.channel.send({
            embeds: [embed]
        });

    }

};
