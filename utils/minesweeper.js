const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// Stores all active games in memory, shared between the command and the button handler
const games = new Map();

const SIZE = 5;
const MINE_COUNT = 5;

function generateBoard(firstClickIndex) {

    const totalCells = SIZE * SIZE;

    const board = Array.from({ length: totalCells }, () => ({
        mine: false,
        revealed: false,
        adjacent: 0
    }));

    // Places mines randomly, never on the cell the player first clicked
    let minesPlaced = 0;

    while (minesPlaced < MINE_COUNT) {

        const randomIndex = Math.floor(Math.random() * totalCells);

        if (randomIndex === firstClickIndex) continue;
        if (board[randomIndex].mine) continue;

        board[randomIndex].mine = true;
        minesPlaced++;

    }

    // Calculates the number of adjacent mines for each cell
    for (let i = 0; i < totalCells; i++) {

        if (board[i].mine) continue;

        board[i].adjacent = getNeighbors(i).filter(n => board[n].mine).length;

    }

    return board;

}

function getNeighbors(index) {

    const row = Math.floor(index / SIZE);
    const col = index % SIZE;

    const neighbors = [];

    for (let dr = -1; dr <= 1; dr++) {

        for (let dc = -1; dc <= 1; dc++) {

            if (dr === 0 && dc === 0) continue;

            const newRow = row + dr;
            const newCol = col + dc;

            if (newRow >= 0 && newRow < SIZE && newCol >= 0 && newCol < SIZE) {
                neighbors.push(newRow * SIZE + newCol);
            }

        }

    }

    return neighbors;

}

// Reveals a cell, auto-revealing connected empty cells (flood fill)
function revealCell(board, index) {

    if (board[index].revealed) return;

    board[index].revealed = true;

    if (board[index].mine) return;

    if (board[index].adjacent === 0) {

        for (const neighbor of getNeighbors(index)) {

            if (!board[neighbor].revealed && !board[neighbor].mine) {
                revealCell(board, neighbor);
            }

        }

    }

}

function checkWin(board) {

    return board.every(cell => cell.mine || cell.revealed);

}

function buildBoard(board, gameId, disabled = false) {

    const rows = [];

    for (let r = 0; r < SIZE; r++) {

        const row = new ActionRowBuilder();

        for (let c = 0; c < SIZE; c++) {

            const index = r * SIZE + c;
            const cell = board[index];

            const button = new ButtonBuilder()
                .setCustomId(`msw_${gameId}_${index}`)
                .setDisabled(disabled || cell.revealed);

            if (cell.revealed && cell.mine) {

                button.setEmoji("💣").setStyle(ButtonStyle.Danger);

            } else if (cell.revealed && cell.adjacent > 0) {

                button.setLabel(cell.adjacent.toString()).setStyle(ButtonStyle.Primary);

            } else if (cell.revealed) {

                button.setLabel("\u200b").setStyle(ButtonStyle.Success);

            } else if (disabled && cell.mine) {

                // Reveals remaining mines when the game ends in a loss
                button.setEmoji("💣").setStyle(ButtonStyle.Danger);

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
    SIZE,
    MINE_COUNT,
    generateBoard,
    revealCell,
    checkWin,
    buildBoard
};
  
