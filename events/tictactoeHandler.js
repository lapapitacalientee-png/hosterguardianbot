const { EmbedBuilder } = require("discord.js");

const {
    games,
    checkWinner,
    bestAiMove,
    buildBoard
} = require("../utils/tictactoe");

module.exports = (client) => {

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith("ttt_")) return;

        const [, gameId, indexStr] = interaction.customId.split("_");
        const index = parseInt(indexStr, 10);

        const game = games.get(gameId);

        if (!game) {

            return interaction.reply({
                content: "This game is no longer active.",
                ephemeral: true
            });

        }

        const currentPlayerId = game.players[game.turn];

        if (interaction.user.id !== currentPlayerId) {

            return interaction.reply({
                content: "It's not your turn, or you're not part of this game!",
                ephemeral: true
            });

        }

        if (game.board[index]) {

            return interaction.reply({
                content: "That cell is already taken!",
                ephemeral: true
            });

        }

        game.board[index] = game.turn;

        let winner = checkWinner(game.board);

        if (!winner) {

            game.turn = game.turn === "X" ? "O" : "X";

            // If it's now the AI's turn, make its move immediately
            if (game.players.O === "AI" && game.turn === "O") {

                const aiMove = bestAiMove(game.board);

                if (aiMove !== null) {

                    game.board[aiMove] = "O";
                    winner = checkWinner(game.board);

                    if (!winner) game.turn = "X";

                }

            }

        }

        const isOver = !!winner;

        let description;

        if (winner === "draw") {

            description = "🤝 It's a draw!";

        } else if (winner) {

            const winnerId = game.players[winner];

            description = winnerId === "AI"
                ? "🤖 The AI wins!"
                : `🎉 <@${winnerId}> wins!`;

        } else {

            const nextId = game.players[game.turn];

            description = nextId === "AI"
                ? "🤖 AI is thinking..."
                : `It's <@${nextId}>'s turn (${game.turn === "X" ? "❌" : "⭕"}).`;

        }

        const embed = new EmbedBuilder()

            .setColor(isOver ? (winner === "draw" ? "Grey" : "Green") : "Blue")

            .setTitle("❌⭕ Tic-Tac-Toe")

            .setDescription(description)

            .setFooter({
                text: "RP Claim System"
            });

        await interaction.update({
            embeds: [embed],
            components: buildBoard(game.board, gameId, isOver)
        });

        if (isOver) {
            games.delete(gameId);
        }

    });

};
              
