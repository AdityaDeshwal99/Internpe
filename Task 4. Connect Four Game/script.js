document.addEventListener("DOMContentLoaded", () => {
  const ROWS = 6;
  const COLS = 7;
  let board = [];
  let currentPlayer = 1; // Player 1 is red, Player 2 is yellow
  let gameOver = false;
  let scores = [0, 0];

  const boardElement = document.getElementById("board");
  const statusElement = document.querySelector(".status");
  const resetButton = document.getElementById("reset-btn");
  const score1Element = document.getElementById("score1");
  const score2Element = document.getElementById("score2");

  // Initialize the game
  function initGame() {
    board = Array(ROWS)
      .fill()
      .map(() => Array(COLS).fill(0));
    currentPlayer = 1;
    gameOver = false;
    renderBoard();
    updateStatus();
  }

  // Render the game board
  function renderBoard() {
    boardElement.innerHTML = "";

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;

        if (board[row][col] === 1) {
          cell.classList.add("red");
        } else if (board[row][col] === 2) {
          cell.classList.add("yellow");
        }

        cell.addEventListener("click", () => handleCellClick(row, col));
        boardElement.appendChild(cell);
      }
    }
  }

  // Handle cell click
  function handleCellClick(row, col) {
    if (gameOver) return;

    // Find the lowest empty row in the column
    const emptyRow = findEmptyRow(col);
    if (emptyRow === -1) return; // Column is full

    board[emptyRow][col] = currentPlayer;
    renderBoard();

    if (checkWin(emptyRow, col)) {
      gameOver = true;
      scores[currentPlayer - 1]++;
      updateScores();
      highlightWinningCells(emptyRow, col);
      statusElement.textContent = `Player ${currentPlayer} (${
        currentPlayer === 1 ? "Red" : "Yellow"
      }) Wins!`;
      return;
    }

    if (checkDraw()) {
      gameOver = true;
      statusElement.textContent = "It's a Draw!";
      return;
    }

    // Switch player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateStatus();
  }

  // Find the lowest empty row in a column
  function findEmptyRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === 0) {
        return row;
      }
    }
    return -1; // Column is full
  }

  // Check for a win
  function checkWin(row, col) {
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal down-right
      [1, -1], // Diagonal down-left
    ];

    for (const [dx, dy] of directions) {
      let count = 1;

      // Check in positive direction
      count += countDirection(row, col, dx, dy);
      // Check in negative direction
      count += countDirection(row, col, -dx, -dy);

      if (count >= 4) {
        return true;
      }
    }

    return false;
  }

  // Count consecutive pieces in a direction
  function countDirection(row, col, dx, dy) {
    let count = 0;
    let r = row + dx;
    let c = col + dy;

    while (
      r >= 0 &&
      r < ROWS &&
      c >= 0 &&
      c < COLS &&
      board[r][c] === currentPlayer
    ) {
      count++;
      r += dx;
      c += dy;
    }

    return count;
  }

  // Highlight winning cells
  function highlightWinningCells(row, col) {
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal down-right
      [1, -1], // Diagonal down-left
    ];

    for (const [dx, dy] of directions) {
      let winningCells = [{ row, col }];

      // Check in positive direction
      winningCells = winningCells.concat(getDirectionCells(row, col, dx, dy));
      // Check in negative direction
      winningCells = winningCells.concat(getDirectionCells(row, col, -dx, -dy));

      if (winningCells.length >= 4) {
        // Highlight the first 4 cells (in case of more than 4)
        for (let i = 0; i < 4; i++) {
          const cell = document.querySelector(
            `[data-row="${winningCells[i].row}"][data-col="${winningCells[i].col}"]`
          );
          cell.classList.add("winner-animation");
        }
        return;
      }
    }
  }

  // Get consecutive pieces in a direction
  function getDirectionCells(row, col, dx, dy) {
    const cells = [];
    let r = row + dx;
    let c = col + dy;

    while (
      r >= 0 &&
      r < ROWS &&
      c >= 0 &&
      c < COLS &&
      board[r][c] === currentPlayer
    ) {
      cells.push({ row: r, col: c });
      r += dx;
      c += dy;
    }

    return cells;
  }

  // Check for a draw
  function checkDraw() {
    return board.every((row) => row.every((cell) => cell !== 0));
  }

  // Update game status
  function updateStatus() {
    statusElement.textContent = `Player ${currentPlayer}'s Turn (${
      currentPlayer === 1 ? "Red" : "Yellow"
    })`;
  }

  // Update scores
  function updateScores() {
    score1Element.textContent = scores[0];
    score2Element.textContent = scores[1];
  }

  // Reset the game
  resetButton.addEventListener("click", () => {
    initGame();
  });

  // Initialize the game on load
  initGame();
});
