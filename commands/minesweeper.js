const {
    EmbedBuilder
} = require("discord.js");

const {
    games,
    SIZE,
    MINE_COUNT,
    buildBoard
} = require("../utils/minesweeper");

module.exports = {

    name: "minesweeper",

    description: "Play a game of Minesweeper.",

    async execute(message) {

        const gameId = message.id;

        // The board is generated empty at first; mines get placed after the first click
        // so the player never loses on their very first move
        const emptyBoard = Array.from({ length: SIZE * SIZE }, () => ({
            mine: false,
            revealed: false,
            adjacent: 0
        }));

        games.set(gameId, {
            board: emptyBoard,
            started: false,
            playerId: message.author.id
        });

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle("💣 Minesweeper")

            .setDescription(
                `${message.author} started a game.\n\n` +
                `**${MINE_COUNT}** mines hidden in a **${SIZE}x${SIZE}** grid.\nClick a cell to reveal it!`
            )

            .setFooter({
                text: "RP Claim System"
            });

        return message.channel.send({
            embeds: [embed],
            components: buildBoard(emptyBoard, gameId)
        });

    }

};

