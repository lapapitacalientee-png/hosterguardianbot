const {
    EmbedBuilder
} = require("discord.js");

module.exports = {

    name: "support",

    description: "Ask the AI assistant for help.",

    async execute(message, client, args) {

        if (!args[0]) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage: `!support <your question>`\n\nExample:\n`!support How do I claim a roleplay?`"
                        )
                ]
            });

        }

        const question = args.join(" ");

        await message.channel.sendTyping().catch(() => {});

        try {

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [
                                {
                                    text:
                                        "You are a helpful support assistant for a Discord roleplay hosting server. " +
                                        "Hosters use commands like !claim, !currentclaims, !cancelclaim, and !help. " +
                                        "Answer questions clearly and briefly, in a friendly tone."
                                }
                            ]
                        },
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    { text: question }
                                ]
                            }
                        ]
                    })
                }
            );

            const data = await response.json();

            console.log("Gemini raw response:", JSON.stringify(data, null, 2));

            const answer =
                data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                `Sorry, I couldn't generate a response. (${data?.error?.message || "unknown reason"})`;

            const embed = new EmbedBuilder()

                .setColor("Purple")

                .setTitle("🤖 AI Support")

                .addFields(

                    {
                        name: "❓ Question",
                        value: question.slice(0, 1024)
                    },

                    {
                        name: "💡 Answer",
                        value: answer.slice(0, 1024)
                    }

                )

                .setFooter({
                    text: `Asked by ${message.author.tag}`
                })

                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        } catch (error) {

            console.log("AI Support Error:", error);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ AI Error")
                        .setDescription(
                            "Something went wrong while contacting the AI. Please try again later."
                        )
                ]
            });

        }

    }

};
        
