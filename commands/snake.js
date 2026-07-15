const {
    EmbedBuilder
} = require("discord.js");

const {
    games,
    createGame,
    renderBoard,
    buildControls
} = require("../utils/snake");

module.exports = {

    name: "snake",

    description: "Play a game of Snake.",

    async execute(message) {

        const gameId = message.id;

        const game = createGame(message.author.id);

        games.set(gameId, game);

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle("🐍 Snake")

            .setDescription(renderBoard(game))

            .addFields({
                name: "Score",
                value: `${game.score}`,
                inline: true
            })

            .setFooter({
                text: `Playing as ${message.author.tag}`
            });

        return message.channel.send({
            embeds: [embed],
            components: buildControls(gameId)
        });

    }

};

