const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

module.exports = {

    name: "title",

    description: "Change a user's server nickname (Administrator only).",

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

        const target = message.mentions.members.first();

        if (!target || args.length < 2) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage: `!title @user <new nickname>`\n\nExample:\n`!title @Hoster Elite Hoster`"
                        )
                ]
            });

        }

        const newNickname = args.slice(1).join(" ");

        if (newNickname.length > 32) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Nickname Too Long")
                        .setDescription("Nicknames can't be longer than 32 characters.")
                ]
            });

        }

        try {

            await target.setNickname(newNickname);

        } catch (error) {

            console.log("Title command error:", error);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Couldn't Change Nickname")
                        .setDescription(
                            "I don't have permission to change this user's nickname.\n\n" +
                            "This usually happens if their highest role is above mine, or they're the server owner."
                        )
                ]
            });

        }

        const embed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("✅ Nickname Updated")

            .setThumbnail(target.displayAvatarURL())

            .addFields(

                {
                    name: "👤 User",
                    value: `${target}`,
                    inline: true
                },

                {
                    name: "📝 New Nickname",
                    value: newNickname,
                    inline: true
                }

            )

            .setFooter({
                text: `Changed by ${message.author.tag}`
            })

            .setTimestamp();

        return message.channel.send({
            embeds: [embed]
        });

    }

};
                              
