const { EmbedBuilder } = require("discord.js");

const {
    games,
    moveSnake,
    renderBoard,
    buildControls
} = require("../utils/snake");

module.exports = (client) => {

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith("snake_")) return;
        if (interaction.customId.includes("spacer")) return;

        const [, gameId, direction] = interaction.customId.split("_");

        const game = games.get(gameId);

        if (!game) {

            return interaction.reply({
                content: "This game is no longer active.",
                ephemeral: true
            });

        }

        if (interaction.user.id !== game.playerId) {

            return interaction.reply({
                content: "This isn't your game! Start your own with `!snake`.",
                ephemeral: true
            });

        }

        moveSnake(game, direction);

        const embed = new EmbedBuilder()

            .setColor(game.gameOver ? "Red" : "Blue")

            .setTitle("🐍 Snake")

            .setDescription(renderBoard(game))

            .addFields({
                name: "Score",
                value: `${game.score}`,
                inline: true
            })

            .setFooter({
                text: game.gameOver ? "Game Over!" : `Playing as ${interaction.user.tag}`
            });

        await interaction.update({
            embeds: [embed],
            components: buildControls(gameId, game.gameOver)
        });

        if (game.gameOver) {
            games.delete(gameId);
        }

    });

};

