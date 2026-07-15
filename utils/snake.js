const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// Stores all active games in memory, shared between the command and the button handler
const games = new Map();

const SIZE = 8;

const DIRECTIONS = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 }
};

const OPPOSITES = {
    up: "down",
    down: "up",
    left: "right",
    right: "left"
};

function createGame(playerId) {

    const startX = Math.floor(SIZE / 2);
    const startY = Math.floor(SIZE / 2);

    const snake = [{ x: startX, y: startY }];

    const game = {
        playerId,
        snake,
        direction: "right",
        food: null,
        score: 0,
        gameOver: false
    };

    game.food = placeFood(game);

    return game;

}

function placeFood(game) {

    let position;

    do {

        position = {
            x: Math.floor(Math.random() * SIZE),
            y: Math.floor(Math.random() * SIZE)
        };

    } while (game.snake.some(segment => segment.x === position.x && segment.y === position.y));

    return position;

}

// Moves the snake one step in the given direction. Returns the game state after the move.
function moveSnake(game, direction) {

    // Ignores the move if it's a direct reversal into the snake's own body
    if (game.snake.length > 1 && direction === OPPOSITES[game.direction]) {
        return game;
    }

    game.direction = direction;

    const { dx, dy } = DIRECTIONS[direction];
    const head = game.snake[0];

    const newHead = { x: head.x + dx, y: head.y + dy };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= SIZE || newHead.y < 0 || newHead.y >= SIZE) {
        game.gameOver = true;
        return game;
    }

    // Self collision
    if (game.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        game.gameOver = true;
        return game;
    }

    game.snake.unshift(newHead);

    const ateFood = newHead.x === game.food.x && newHead.y === game.food.y;

    if (ateFood) {

        game.score++;
        game.food = placeFood(game);

    } else {

        game.snake.pop();

    }

    return game;

}

function renderBoard(game) {

    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill("⬛"));

    game.snake.forEach((segment, i) => {
        grid[segment.y][segment.x] = i === 0 ? "🟢" : "🟩";
    });

    if (game.food) {
        grid[game.food.y][game.food.x] = "🍎";
    }

    return grid.map(row => row.join("")).join("\n");

}

function buildControls(gameId, disabled = false) {

    const spacer = (id) => new ButtonBuilder()
        .setCustomId(id)
        .setLabel("\u200b")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

    const dirButton = (direction, emoji) => new ButtonBuilder()
        .setCustomId(`snake_${gameId}_${direction}`)
        .setEmoji(emoji)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);

    const row1 = new ActionRowBuilder().addComponents(
        spacer(`snake_spacer1_${gameId}`),
        dirButton("up", "⬆️"),
        spacer(`snake_spacer2_${gameId}`)
    );

    const row2 = new ActionRowBuilder().addComponents(
        dirButton("left", "⬅️"),
        dirButton("down", "⬇️"),
        dirButton("right", "➡️")
    );

    return [row1, row2];

}

module.exports = {
    games,
    SIZE,
    createGame,
    moveSnake,
    renderBoard,
    buildControls
};
  
