const {
    EmbedBuilder,
    PermissionsBitField,
    ChannelType
} = require("discord.js");

module.exports = {

    name: "unlock",

    description: "Unlock the current channel, or the whole server with 'all' (Administrator only).",

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

        // Desbloquea TODO el servidor
        if (scope === "all") {

            const textChannels = message.guild.channels.cache.filter(
                c => c.type === ChannelType.GuildText
            );

            let count = 0;

            for (const [, channel] of textChannels) {

                try {

                    await channel.permissionOverwrites.edit(
                        message.guild.roles.everyone,
                        { SendMessages: null }
                    );

                    count++;

                } catch (err) {
                    // Sin permiso en ese canal en particular, sigue con los demás
                }

            }

            const embed = new EmbedBuilder()

                .setColor("Green")

                .setTitle("🔓 Server Unlocked")

                .setDescription(`Unlocked **${count}** text channels.`)

                .setFooter({
                    text: `Unlocked by ${message.author.tag}`
                })

                .setTimestamp();

            return message.channel.send({ embeds: [embed] });

        }

        // Desbloquea solo el canal actual
        try {

            await message.channel.permissionOverwrites.edit(
                message.guild.roles.everyone,
                { SendMessages: null }
            );

            const embed = new EmbedBuilder()

                .setColor("Green")

                .setTitle("🔓 Channel Unlocked")

                .setDescription(`${message.channel} has been unlocked. Everyone can send messages again.`)

                .setFooter({
                    text: `Unlocked by ${message.author.tag}`
                })

                .setTimestamp();

            return message.channel.send({ embeds: [embed] });

        } catch (error) {

            console.log("Unlock command error:", error);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Couldn't Unlock Channel")
                        .setDescription("I might be missing the **Manage Channels** permission.")
                ]
            });

        }

    }

};

