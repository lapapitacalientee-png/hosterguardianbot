const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getConfig, saveConfig } = require("../utils/config");

module.exports = {
    name: "restartsetup",

    async execute(message) {

        // Admin permission check
        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {
            return message.reply({
                content: "❌ You need Administrator permissions to use this command.",
                ephemeral: true
            });
        }


        const config = getConfig();

        const oldChannels = config.setupChannels || [];


        const channelList = oldChannels.length
            ? oldChannels.map(id => `<#${id}>`).join("\n")
            : "No saved setup channels";


        // Clear setup
        config.setupChannels = [];

        saveConfig(config);



        const embed = new EmbedBuilder()
            .setTitle("🔄 Setup Restarted")
            .setColor("Orange")
            .setDescription(
                "The saved setup configuration has been successfully reset."
            )
            .addFields(
                {
                    name: "📂 Previous Setup Channels",
                    value: channelList
                },
                {
                    name: "🧹 Action",
                    value: "Removed saved setup channel list."
                },
                {
                    name: "👤 Requested by",
                    value: `${message.author}`
                }
            )
            .setThumbnail(
                message.author.displayAvatarURL({
                    dynamic: true
                })
            )
            .setTimestamp()
            .setFooter({
                text: "HosterGuardian Setup Manager"
            });


        message.reply({
            embeds: [embed]
        });

    }
};
