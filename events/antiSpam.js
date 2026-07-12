const { PermissionsBitField } = require("discord.js");

const spamData = new Map();

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (!message.guild) return;
        if (message.author.bot) return;

        // Ignore administrators
        if (message.member.permissions.has(
            PermissionsBitField.Flags.Administrator
        )) return;


        const userId = message.author.id;
        const now = Date.now();


        if (!spamData.has(userId)) {
            spamData.set(userId, {
                messages: [],
                warnings: 0
            });
        }


        const userData = spamData.get(userId);


        userData.messages.push(now);


        // Only keep messages from the last 5 seconds
        userData.messages = userData.messages.filter(
            time => now - time < 5000
        );


        // 5 messages in 5 seconds = spam
        if (userData.messages.length >= 5) {

            userData.messages = [];
            userData.warnings++;


            try {

                if (userData.warnings === 1) {

                    await message.author.send(
                        "⚠️ **Warning 1/3**\nPlease stop spamming. Continued spam may result in a timeout."
                    );


                } else if (userData.warnings === 2) {

                    await message.author.send(
                        "⚠️ **Warning 2/3**\nThis is your final warning."
                    );


                } else {


                    await message.member.timeout(
                        10 * 60 * 1000,
                        "Automatic moderation: Spam"
                    );


                    await message.author.send(
                        "🔇 You have been timed out for **10 minutes** due to repeated spam."
                    );


                    userData.warnings = 0;

                }


            } catch (error) {

                console.log(
                    "Anti-spam error:",
                    error
                );

            }

        }

    });

};
