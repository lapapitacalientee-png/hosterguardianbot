const {
    EmbedBuilder
} = require("discord.js");

module.exports = {

    name: "avatar",

    description: "View a user's avatar by mention or ID, even if they're not in this server.",

    async execute(message, client, args) {

        // Accepts a mention (<@id> or <@!id>), a plain ID, or defaults to the author
        const rawInput = args[0]?.replace(/[<@!>]/g, "") || message.author.id;

        if (!/^\d{15,25}$/.test(rawInput)) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage: `!avatar <@user or user ID>`\n\n" +
                            "Example:\n`!avatar @Juan`\n`!avatar 123456789012345678`"
                        )
                ]
            });

        }

        let user;

        try {

            user = await client.users.fetch(rawInput);

        } catch (error) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ User Not Found")
                        .setDescription("I couldn't find a Discord user with that ID.")
                ]
            });

        }

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle(`${user.username}'s Avatar`)

            .setImage(user.displayAvatarURL({ size: 1024 }))

            .setFooter({
                text: `Requested by ${message.author.tag}`
            })

            .setTimestamp();

        return message.channel.send({
            embeds: [embed]
        });

    }

};

