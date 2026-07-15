const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

const {
    clearLogChannel
} = require("../utils/logsConfig");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function progressBar(percent) {

    const totalBlocks = 20;
    const filledBlocks = Math.round((percent / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;

    return "▓".repeat(filledBlocks) + "░".repeat(emptyBlocks) + ` ${percent}%`;

}

module.exports = {

    name: "restart",

    description: "Restart the bot (Administrator only).",

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

        const steps = [
            { text: "🔄 Initializing restart sequence...", percent: 0 },
            { text: "📡 Disconnecting from Discord gateway...", percent: 20 },
            { text: "🧹 Clearing cache...", percent: 40 },
            { text: "⚙️ Reloading commands...", percent: 60 },
            { text: "🔌 Reconnecting to Discord API...", percent: 80 },
            { text: "✅ Finalizing...", percent: 100 }
        ];

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle("🔄 Restarting Bot")
            .setDescription(`${steps[0].text}\n\n${progressBar(steps[0].percent)}`)
            .setTimestamp();

        const statusMessage = await message.channel.send({ embeds: [embed] });

        for (let i = 1; i < steps.length; i++) {

            // Random delay between 1-2 seconds for a realistic feel
            const delay = Math.floor(Math.random() * 1000) + 1000;
            await sleep(delay);

            const stepEmbed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle("🔄 Restarting Bot")
                .setDescription(`${steps[i].text}\n\n${progressBar(steps[i].percent)}`)
                .setTimestamp();

            await statusMessage.edit({ embeds: [stepEmbed] }).catch(() => {});

        }

        // Real action: reset the saved log channel config for this server
        clearLogChannel(message.guild.id);

        await sleep(1000);

        const finalEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Bot Reset")
            .setDescription(
                "The bot has been restarted successfully.\n\n" +
                "The configured log channel has been cleared. Use `!setupbotlogs #channel` to set it up again."
            )
            .setTimestamp();

        return statusMessage.edit({ embeds: [finalEmbed] });

    }

};
  
