const {
    EmbedBuilder
} = require("discord.js");

const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

module.exports = {

    name: "poll",

    description: "Create a quick poll with reactions.",

    async execute(message, client, args) {

        const raw = args.join(" ");

        const parts = raw.split("|").map(p => p.trim()).filter(Boolean);

        if (parts.length < 3) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage:\n`!poll Question | Option 1 | Option 2 | ...`\n\n" +
                            "You need at least 2 options, and a maximum of 10.\n\n" +
                            "Example:\n`!poll Best RP night? | Friday | Saturday | Sunday`"
                        )
                ]
            });

        }

        const question = parts[0];
        const options = parts.slice(1);

        if (options.length > 10) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Too Many Options")
                        .setDescription("Polls can have a maximum of 10 options.")
                ]
            });

        }

        const description = options
            .map((opt, i) => `${numberEmojis[i]}  ${opt}`)
            .join("\n\n");

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle(`📊 ${question}`)

            .setDescription(description)

            .setFooter({
                text: `Poll started by ${message.author.tag}`
            })

            .setTimestamp();

        await message.delete().catch(() => {});

        const pollMessage = await message.channel.send({ embeds: [embed] });

        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(numberEmojis[i]).catch(() => {});
        }

        return pollMessage;

    }

};
      
