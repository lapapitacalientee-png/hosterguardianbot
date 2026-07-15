const {
    EmbedBuilder,
    PermissionsBitField,
    ChannelType
} = require("discord.js");

module.exports = {

    name: "lockdown",

    description: "Lock the current channel, or the whole server with 'all' (Administrator only).",

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

        const scope = args[0]?.toLowerCase();

        // Bloquea TODO el servidor
        if (scope === "all") {

            const textChannels = message.guild.channels.cache.filter(
                c => c.type === ChannelType.GuildText
            );

            let count = 0;

            for (const [, channel] of textChannels) {

                try {

                    await channel.permissionOverwrites.edit(
                        message.guild.roles.everyone,
                        { SendMessages: false }
                    );

                    count++;

                } catch (err) {
                    // Sin permiso en ese canal en particular, sigue con los demás
                }

            }

            const embed = new EmbedBuilder()

                .setColor("Red")

                .setTitle("🔒 Server Locked Down")

                .setDescription(
                    `Locked **${count}** text channels. Only staff with override permissions can send messages.\n\nUse \`!unlock all\` to reopen everything.`
                )

                .setFooter({
                    text: `Locked by ${message.author.tag}`
                })

                .setTimestamp();

            return message.channel.send({ embeds: [embed] });

        }

        // Bloquea solo el canal actual
        try {

            await message.channel.permissionOverwrites.edit(
                message.guild.roles.everyone,
                { SendMessages: false }
            );

            const embed = new EmbedBuilder()

                .setColor("Red")

                .setTitle("🔒 Channel Locked")

                .setDescription(
                    `${message.channel} has been locked. Only staff with override permissions can send messages here.\n\nUse \`!unlock\` to reopen it.`
                )

                .setFooter({
                    text: `Locked by ${message.author.tag}`
                })

                .setTimestamp();

            return message.channel.send({ embeds: [embed] });

        } catch (error) {

            console.log("Lockdown command error:", error);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Couldn't Lock Channel")
                        .setDescription("I might be missing the **Manage Channels** permission.")
                ]
            });

        }

    }

};

