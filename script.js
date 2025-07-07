// === Firebase Init ===
const firebaseConfig = {
  apiKey: "AIzaSyCU34AXm29TLwmag5hf6hymFztK2ciW2HI",
  authDomain: "arcadium-test-297c0.firebaseapp.com",
  projectId: "arcadium-test-297c0",
  storageBucket: "arcadium-test-297c0.appspot.com",
  messagingSenderId: "1007954059983",
  appId: "1:1007954059983:web:a1c09597d4cfddf010cdba",
  measurementId: "G-F6C4GLX7Q5"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const user = tg.initDataUnsafe?.user;
  const usernameElem = document.getElementById("username");
  const profilePic = document.getElementById("profile-pic");
  const scoreboard = document.getElementById("scoreboard");

  let userId = "guest";
  let userRef;

  if (user) {
    userId = String(user.id);
    const fullName = user.first_name + (user.last_name ? " " + user.last_name : "");
    usernameElem.innerText = fullName;

    if (user.photo_url) {
      profilePic.src = user.photo_url;
    } else {
      profilePic.src = "https://via.placeholder.com/150/4CAF50/ffffff?text=" + encodeURIComponent(user.first_name[0]);
    }

    // Firestore ref
    userRef = db.collection("players").doc(userId);

    // Init user doc if not exists
    userRef.get().then((doc) => {
      if (!doc.exists) {
        userRef.set({
          name: fullName,
          photo: user.photo_url || "",
          wins: 0,
          losses: 0,
          draws: 0
        });
      }
    }).then(() => {
      loadScore();
    });

  } else {
    usernameElem.innerText = "Guest";
  }

  profilePic.addEventListener("click", () => {
    usernameElem.classList.toggle("hidden");
  });

  // === Game Logic ===
  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("game-status");
  const resetBtn = document.getElementById("reset-btn");

  let board = Array(9).fill("");
  let gameOver = false;

  function renderBoard() {
    boardEl.innerHTML = "";
    board.forEach((cell, i) => {
      const cellEl = document.createElement("div");
      cellEl.classList.add("cell");
      cellEl.textContent = cell;
      cellEl.addEventListener("click", () => handlePlayerMove(i));
      boardEl.appendChild(cellEl);
    });
  }

  function handlePlayerMove(index) {
    if (board[index] || gameOver) return;
    board[index] = "X";
    renderBoard();

    if (checkWin("X")) {
      statusEl.textContent = "You win! 🎉";
      gameOver = true;
      updateScore("win");
      return;
    }

    if (board.every(cell => cell)) {
      statusEl.textContent = "It's a draw!";
      gameOver = true;
      updateScore("draw");
      return;
    }

    statusEl.textContent = "Bot's turn...";
    setTimeout(botMove, 500);
  }

  function botMove() {
    let emptyCells = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (emptyCells.length === 0) return;
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = "O";
    renderBoard();

    if (checkWin("O")) {
      statusEl.textContent = "Bot wins! 😞";
      gameOver = true;
      updateScore("loss");
    } else if (board.every(cell => cell)) {
      statusEl.textContent = "It's a draw!";
      gameOver = true;
      updateScore("draw");
    } else {
      statusEl.textContent = "Your move!";
    }
  }

  function checkWin(symbol) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return wins.some(combo => combo.every(i => board[i] === symbol));
  }

  function updateScore(result) {
    if (!userRef) return;

    let field;
    if (result === "win") field = "wins";
    else if (result === "loss") field = "losses";
    else if (result === "draw") field = "draws";

    userRef.update({
      [field]: firebase.firestore.FieldValue.increment(1)
    }).then(() => {
      loadScore();
    });
  }

  function loadScore() {
    if (!userRef) return;

    userRef.onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        scoreboard.textContent = `Wins: ${data.wins} | Losses: ${data.losses} | Draws: ${data.draws}`;
      }
    });
  }

  resetBtn.addEventListener("click", () => {
    board = Array(9).fill("");
    gameOver = false;
    statusEl.textContent = "Your move!";
    renderBoard();
  });

  renderBoard();
});
