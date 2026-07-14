const {
    EmbedBuilder
} = require("discord.js");

const {
    setStatus,
    getVerification
} = require("../utils/verification");

module.exports = {

    name: "approve",

    description: "Approve a hoster's verification form (Bot Owner only).",

    async execute(message, client, args) {

        if (message.author.id !== process.env.OWNER_ID) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Permission Denied")
                        .setDescription("Only the bot owner can use this command.")
                ]
            });

        }

        const target = message.mentions.users.first();

        if (!target) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage: `!approve @user [note]`\n\nExample:\n`!approve @Juan Great experience!`"
                        )
                ]
            });

        }

        const verification = getVerification(target.id);

        if (!verification || !verification.answers || verification.answers.length === 0) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ No Form Found")
                        .setDescription("This user hasn't submitted a verification form.")
                ]
            });

        }

        const note = args.slice(1).join(" ");

        setStatus(target.id, "approved", note);

        const dmEmbed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("✅ Verification Approved")

            .setDescription("Your hoster verification form has been **approved**. Welcome aboard!")

            .setTimestamp();

        if (note) {

            dmEmbed.addFields({
                name: "📝 Note from Review",
                value: note
            });

        }

        await target.send({ embeds: [dmEmbed] }).catch(() => {});

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ User Approved")
                    .setDescription(`${target} has been notified of their approval.`)
            ]
        });

    }

};

