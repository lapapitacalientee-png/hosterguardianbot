const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

module.exports = {

    name: "pfp",

    description: "Change the bot's profile picture (Administrator only).",

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

        // Acepta una imagen/gif adjunto, o un link como argumento
        const attachment = message.attachments.first();
        const imageSource = attachment ? attachment.url : args[0];

        if (!imageSource) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Usage")
                        .setDescription(
                            "Attach an image/gif, or provide a direct image link.\n\n" +
                            "Usage:\n`!pfp <image or gif link>`\nor attach a file with `!pfp`"
                        )
                ]
            });

        }

        // Validación básica del formato (jpg, png, gif, webp)
        const validExtensions = /\.(jpe?g|png|gif|webp)(\?.*)?$/i;

        if (!validExtensions.test(imageSource)) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Image")
                        .setDescription(
                            "The link must point directly to an image or gif file (.png, .jpg, .gif, .webp)."
                        )
                ]
            });

        }

        try {

            await client.user.setAvatar(imageSource);

        } catch (error) {

            console.log("PFP command error:", error);

            let reason = "Something went wrong while updating the avatar.";

            if (error.message?.includes("rate limited") || error.status === 429) {

                reason = "Discord only allows changing the bot's avatar a limited number of times per hour. Please wait and try again later.";

            }

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Couldn't Update Avatar")
                        .setDescription(reason)
                ]
            });

        }

        const embed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("✅ Bot Avatar Updated")

            .setImage(imageSource)

            .setFooter({
                text: `Changed by ${message.author.tag}`
            })

            .setTimestamp();

        return message.channel.send({
            embeds: [embed]
        });

    }

};

