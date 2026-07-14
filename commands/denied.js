const {
    EmbedBuilder
} = require("discord.js");

const {
    setStatus,
    getVerification
} = require("../utils/verification");

module.exports = {

    name: "denied",

    description: "Deny a hoster's verification form (Bot Owner only).",

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
                            "Usage: `!denied @user [note]`\n\nExample:\n`!denied @Juan Not enough experience yet.`"
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

        setStatus(target.id, "denied", note);

        const dmEmbed = new EmbedBuilder()

            .setColor("Red")

            .setTitle("❌ Verification Denied")

            .setDescription("Your hoster verification form has been **denied**.")

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
                    .setColor("Red")
                    .setTitle("❌ User Denied")
                    .setDescription(`${target} has been notified of their denial.`)
            ]
        });

    }

};

