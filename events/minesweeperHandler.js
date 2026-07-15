const { EmbedBuilder } = require("discord.js");

const {
    games,
    generateBoard,
    revealCell,
    checkWin,
    buildBoard
} = require("../utils/minesweeper");

module.exports = (client) => {

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith("msw_")) return;

        const [, gameId, indexStr] = interaction.customId.split("_");
        const index = parseInt(indexStr, 10);

        const game = games.get(gameId);

        if (!game) {

            return interaction.reply({
                content: "This game is no longer active.",
                ephemeral: true
            });

        }

        if (interaction.user.id !== game.playerId) {

            return interaction.reply({
                content: "This isn't your game! Start your own with `!minesweeper`.",
                ephemeral: true
            });

        }

        // Generates the real board (with mines) only after the first click,
        // guaranteeing the player never hits a mine on their opening move
        if (!game.started) {

            game.board = generateBoard(index);
            game.started = true;

        }

        revealCell(game.board, index);

        const hitMine = game.board[index].mine;
        const won = !hitMine && checkWin(game.board);
        const isOver = hitMine || won;

        let description;

        if (hitMine) {

            description = "💥 You hit a mine! Game over.";

        } else if (won) {

            description = "🎉 You cleared the board! You win!";

        } else {

            description = "Keep going! Click another cell to reveal it.";

        }

        const embed = new EmbedBuilder()

            .setColor(hitMine ? "Red" : won ? "Green" : "Blue")

            .setTitle("💣 Minesweeper")

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
