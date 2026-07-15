const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// Stores all active games in memory, shared between the command and the button handler
const games = new Map();

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWinner(board) {

    for (const [a, b, c] of winPatterns) {

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }

    }

    if (board.every(cell => cell)) return "draw";

    return null;

}

// Minimax algorithm, makes the AI play perfectly (unbeatable)
function minimax(board, isMaximizing) {

    const winner = checkWinner(board);

    if (winner === "O") return 1;
    if (winner === "X") return -1;
    if (winner === "draw") return 0;

    if (isMaximizing) {

        let best = -Infinity;

        for (let i = 0; i < 9; i++) {

            if (!board[i]) {
                board[i] = "O";
                best = Math.max(best, minimax(board, false));
                board[i] = null;
            }

        }

        return best;

    } else {

        let best = Infinity;

        for (let i = 0; i < 9; i++) {

            if (!board[i]) {
                board[i] = "X";
                best = Math.min(best, minimax(board, true));
                board[i] = null;
            }

        }

        return best;

    }

}

function bestAiMove(board) {

    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {

        if (!board[i]) {

            board[i] = "O";
            const score = minimax(board, false);
            board[i] = null;

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }

        }

    }

    return move;

}

// Builds the 3x3 button grid from the current board state
function buildBoard(board, gameId, disabled = false) {

    const rows = [];

    for (let r = 0; r < 3; r++) {

        const row = new ActionRowBuilder();

        for (let c = 0; c < 3; c++) {

            const index = r * 3 + c;
            const cell = board[index];

            const button = new ButtonBuilder()
                .setCustomId(`ttt_${gameId}_${index}`)
                .setDisabled(disabled || !!cell);

            if (cell === "X") {
                button.setEmoji("❌").setStyle(ButtonStyle.Danger);
            } else if (cell === "O") {
                button.setEmoji("⭕").setStyle(ButtonStyle.Primary);
            } else {
                button.setLabel("\u200b").setStyle(ButtonStyle.Secondary);
            }

            row.addComponents(button);

        }

        rows.push(row);

    }

    return rows;

}

module.exports = {
    games,
    checkWinner,
    bestAiMove,
    buildBoard
};
