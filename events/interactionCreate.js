const { EmbedBuilder } = require("discord.js");

const {
    setAnswers
} = require("../utils/verification");

const questions = [
    "Have you been a hoster or moderator before (in this server or in other communities)?",
    "If yes, which servers/communities were you a hoster or mod in? (Type 'N/A' if none)",
    "What was your username in those servers? (Type 'N/A' if none)",
    "How long have you been hosting or moderating roleplays in total?",
    "How would you describe your hosting style? (e.g. narrative-heavy, combat-focused, casual)",
    "Have you ever been banned or removed from a hosting/mod position? If so, briefly explain why. (Type 'N/A' if not applicable)",
    "Do you agree to follow this server's hosting rules and guidelines? (yes/no)",
    "Do you promise to handle sensitive information, such as private reports, responsibly and confidentially? (yes/no)"
];

module.exports = (client) => {

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;
        if (interaction.customId !== "start_hoster_verify") return;

        let dmChannel;

        try {

            dmChannel = await interaction.user.createDM();

            await interaction.reply({
                content: "📬 Check your DMs to complete the verification form!",
                ephemeral: true
            });

        } catch (err) {

            return interaction.reply({
                content: "❌ I couldn't DM you. Please enable DMs from server members and try again.",
                ephemeral: true
            });

        }

        const answers = [];

        try {

            await dmChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle("📋 Hoster Verification Form")
                        .setDescription(
                            "Please answer the following questions one at a time.\nYou have **5 minutes** to answer each question."
                        )
                ]
            });

            for (let i = 0; i < questions.length; i++) {

                await dmChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blue")
                            .setTitle(`Question ${i + 1} of ${questions.length}`)
                            .setDescription(questions[i])
                    ]
                });

                const collected = await dmChannel.awaitMessages({
                    filter: (m) => m.author.id === interaction.user.id,
                    max: 1,
                    time: 5 * 60 * 1000,
                    errors: ["time"]
                });

                const answer = collected.first().content;

                answers.push({
                    question: questions[i],
                    answer
                });

            }

            setAnswers(interaction.user.id, interaction.guild?.id || null, answers);

            await dmChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setTitle("✅ Form Submitted")
                        .setDescription(
                            "You have finished answering the questions. Your form will be reviewed and you will be notified if it has been accepted."
                        )
                ]
            });

        } catch (err) {

            await dmChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("⏰ Verification Timed Out")
                        .setDescription(
                            "You took too long to respond. Please click **Verify** again to restart the form."
                        )
                ]
            }).catch(() => {});

        }

    });

};
          
