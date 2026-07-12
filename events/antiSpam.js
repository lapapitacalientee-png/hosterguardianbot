const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getConfig } = require("../utils/config");

const spamData = new Map();

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (!message.guild) return;
        if (message.author.bot) return;


        // Ignore administrators
        if (
            message.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) return;


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


        // Keep messages from last 5 seconds
        userData.messages = userData.messages.filter(
            time => now - time < 5000
        );


        // Spam detected
        if (userData.messages.length >= 5) {

            userData.messages = [];
            userData.warnings++;


            const config = getConfig();

            const logChannel = config.logChannel
                ? client.channels.cache.get(config.logChannel)
                : null;


            let action = "";


            if (userData.warnings === 1) {

                action = "⚠️ Warning 1/3";

                await message.author.send(
                    "⚠️ You received a warning for spamming. Please slow down."
                ).catch(() => {});


            } else if (userData.warnings === 2) {

                action = "⚠️ Warning 2/3";

                await message.author.send(
                    "⚠️ Final warning. Stop spamming or you will be muted."
                ).catch(() => {});


            } else {

                action = "🔇 Timeout (10 minutes)";

                await message.member.timeout(
                    10 * 60 * 1000,
                    "Spam"
                ).catch(() => {});


                await message.author.send(
                    "🔇 You have been timed out for 10 minutes due to repeated spam."
                ).catch(() => {});


                userData.warnings = 0;
            }


            const embed = new EmbedBuilder()
                .setTitle("🚨 Anti-Spam Detection")
                .setDescription(
                    `A user has triggered the anti-spam system.`
                )
                .addFields(
                    {
                        name: "👤 User",
                        value: `${message.author}\n\`${message.author.id}\``
                    },
                    {
                        name: "📍 Channel",
                        value: `${message.channel}`
                    },
                    {
                        name: "📨 Messages",
                        value: "5 messages in 5 seconds"
                    },
                    {
                        name: "⚖️ Action",
                        value: action
                    }
                )
                .setThumbnail(
                    message.author.displayAvatarURL({
                        dynamic: true
                    })
                )
                .setTimestamp()
                .setFooter({
                    text: "HosterGuardian AutoMod"
                });


            if (logChannel) {
                logChannel.send({
                    embeds: [embed]
                });
            }

        }

    });

};
