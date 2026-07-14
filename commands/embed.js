const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

module.exports = {

    name: "embed",

    description: "Create a custom embed (Administrator only).",

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

        const raw = args.join(" ");

        const parts = raw.split("|").map(p => p.trim());

        const [title, description, footer, image] = parts;

        if (!title || !description) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Usage:\n`!embed Title | Description | Footer | Image URL`\n\n" +
                            "Footer and Image URL are optional.\n\n" +
                            "Examples:\n" +
                            "`!embed Server Rules | Please follow the rules.`\n" +
                            "`!embed Event | RP night starts at 8PM | Hosted by staff`\n" +
                            "`!embed Announcement | Check this out! | Staff Team | https://example.com/image.png`"
                        )
                ]
            });

        }

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle(title)

            .setDescription(description)

            .setTimestamp();

        if (footer) {

            embed.setFooter({ text: footer });

        }

        if (image) {

            const validImage = /^https?:\/\/.+\.(jpe?g|png|gif|webp)(\?.*)?$/i.test(image);

            if (validImage) {

                embed.setImage(image);

            } else {

                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle("❌ Invalid Image URL")
                            .setDescription(
                                "The image URL must be a direct link ending in .png, .jpg, .gif, or .webp."
                            )
                    ]
                });

            }

        }

        await message.delete().catch(() => {});

        return message.channel.send({
            embeds: [embed]
        });

    }

};
          
