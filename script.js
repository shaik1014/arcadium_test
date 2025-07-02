const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let cells = Array(9).fill("");
let gameOver = false;

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((val, idx) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = idx;
    cell.textContent = val;
    cell.addEventListener("click", onCellClick);
    board.appendChild(cell);
  });
}

function onCellClick(e) {
  const idx = e.target.dataset.index;
  if (cells[idx] !== "" || gameOver) return;
  cells[idx] = "X";
  renderBoard();
  if (checkWin("X")) return endGame("You win!");
  if (isDraw()) return endGame("Draw!");
  botMove();
}

function botMove() {
  const empty = cells.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  if (empty.length === 0) return;
  const move = empty[Math.floor(Math.random() * empty.length)];
  cells[move] = "O";
  renderBoard();
  if (checkWin("O")) return endGame("Bot wins!");
  if (isDraw()) return endGame("Draw!");
}

function checkWin(player) {
  return winCombos.some(combo => combo.every(i => cells[i] === player));
}

function isDraw() {
  return cells.every(cell => cell !== "");
}

function endGame(message) {
  gameOver = true;
  statusText.textContent = message;
}

function restartGame() {
  cells = Array(9).fill("");
  gameOver = false;
  statusText.textContent = "Your turn (X)";
  renderBoard();
}

restartBtn.addEventListener("click", restartGame);

renderBoard();
