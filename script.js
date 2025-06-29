// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyDZXZoNjP4S7esAxIKqk_xNHh-3PkVpsHs",
  authDomain: "beluga-1014.firebaseapp.com",
  databaseURL: "https://beluga-1014-default-rtdb.firebaseio.com",
  projectId: "beluga-1014",
  storageBucket: "beluga-1014.firebasestorage.app",
  messagingSenderId: "63392649535",
  appId: "1:63392649535:web:12923a6ab8db31e8ee438a",
  measurementId: "G-BVEKBQ0S8M"
};

// === Initialize Firebase ===
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
auth.signInAnonymously().catch(console.error);

// === Telegram Init ===
const tg = window.Telegram.WebApp;
tg.expand(); // Make full screen

// Get Telegram user info
const tgUser = tg.initDataUnsafe?.user || {};
const username = tgUser.username || tgUser.first_name || "Guest";

// Show username in UI
document.querySelector("h1").textContent = `ArcadiumX: @${username}`;

// === Game Setup ===
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

function checkWin(p) {
  return winCombos.some(combo => combo.every(i => cells[i] === p));
}

function isDraw() {
  return cells.every(c => c !== "");
}

function endGame(msg) {
  gameOver = true;
  statusText.textContent = msg;

  const score = msg.includes("win") ? 1 : 0;

  db.collection("scores").add({
    username,
    score,
    result: msg,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    console.log("✅ Score saved!");
  }).catch((err) => {
    console.error("❌ Failed to save score:", err);
  });
}

function restartGame() {
  cells = Array(9).fill("");
  gameOver = false;
  statusText.textContent = "Your turn (X)";
  renderBoard();
}

restartBtn.addEventListener("click", restartGame);

renderBoard();
