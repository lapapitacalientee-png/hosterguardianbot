const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

module.exports = {

    name: "purge",

    description: "Delete a number of recent messages (Administrator only).",

    async execute(message, client, args) {

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

        const amount = parseInt(args[0], 10);

        if (!amount || amount < 1 || amount > 100) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage: `!purge <amount>`\n\nExample:\n`!purge 20`\n\nMax: 100 messages at a time."
                        )
                ]
            });

        }

        try {

            // +1 para incluir el mensaje del comando mismo
            const deleted = await message.channel.bulkDelete(amount + 1, true);

            const embed = new EmbedBuilder()

                .setColor("Green")

                .setTitle("🧹 Messages Purged")

                .setDescription(`Deleted **${deleted.size - 1}** messages in ${message.channel}.`)

                .setFooter({
                    text: `Purged by ${message.author.tag}`
                })

                .setTimestamp();

            const confirmMsg = await message.channel.send({ embeds: [embed] });

            setTimeout(() => confirmMsg.delete().catch(() => {}), 5000);

        } catch (error) {

            console.log("Purge command error:", error);

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Couldn't Delete Messages")
                        .setDescription(
                            "I might be missing the **Manage Messages** permission, or some messages are older than 14 days (Discord doesn't allow bulk-deleting those)."
                        )
                ]
            });

        }

    }

};
