const {
    EmbedBuilder
} = require("discord.js");

const {
    games,
    buildBoard
} = require("../utils/tictactoe");

module.exports = {

    name: "tictactoe",

    description: "Play Tic-Tac-Toe against another user or the AI.",

    async execute(message) {

        const opponent = message.mentions.users.first();

        if (opponent && opponent.bot) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Opponent")
                        .setDescription("You can't challenge a bot. Use `!tictactoe` with no mention to play against the AI.")
                ]
            });

        }

        if (opponent && opponent.id === message.author.id) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Invalid Opponent")
                        .setDescription("You can't play against yourself.")
                ]
            });

        }

        const mode = opponent ? "pvp" : "ai";
        const gameId = message.id;
        const board = Array(9).fill(null);

        games.set(gameId, {
            board,
            players: {
                X: message.author.id,
                O: opponent ? opponent.id : "AI"
            },
            turn: "X"
        });

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle("❌⭕ Tic-Tac-Toe")

            .setDescription(

                mode === "pvp"
                    ? `${message.author} (❌) vs ${opponent} (⭕)\n\nIt's ${message.author}'s turn (❌).`
                    : `${message.author} (❌) vs 🤖 AI (⭕)\n\nIt's your turn (❌).`

            )

            .setFooter({
                text: "RP Claim System"
            });

        return message.channel.send({
            embeds: [embed],
            components: buildBoard(board, gameId)
        });

    }

};

