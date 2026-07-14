const {
    EmbedBuilder
} = require("discord.js");

const {
    setAfk,
    getAfk
} = require("../utils/afk");

module.exports = {

    name: "afk",

    description: "Set yourself as AFK.",

    async execute(message, client, args) {

        const already = getAfk(message.author.id);

        if (already) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Orange")
                        .setTitle("💤 Already AFK")
                        .setDescription("You're already marked as AFK.")
                ]
            });

        }

        const reason = args.join(" ") || "AFK";

        const originalNickname = message.member.nickname;

        setAfk(message.author.id, reason, originalNickname);

        // Intenta agregar el prefijo [AFK] al apodo, si el bot tiene permiso
        try {

            const base = message.member.nickname || message.author.username;

            let newNick = `[AFK] ${base}`;

            if (newNick.length > 32) {
                newNick = newNick.slice(0, 32);
            }

            await message.member.setNickname(newNick);

        } catch (err) {
            // Si no tiene permiso (ej. es el dueño del server), simplemente lo ignora
        }

        const embed = new EmbedBuilder()

            .setColor("Grey")

            .setTitle("💤 AFK Set")

            .setDescription(`You are now AFK: **${reason}**`)

            .setFooter({
                text: "I'll let others know if they mention you."
            })

            .setTimestamp();

        return message.channel.send({
            embeds: [embed]
        });

    }

};
