document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const user = tg.initDataUnsafe?.user;
  const usernameElem = document.getElementById("username");
  const profilePic = document.getElementById("profile-pic");

  if (user) {
    const fullName = user.first_name + (user.last_name ? " " + user.last_name : "");
    usernameElem.innerText = fullName;

    if (user.photo_url) {
      profilePic.src = user.photo_url;
    } else {
      profilePic.src = "https://via.placeholder.com/150/4CAF50/ffffff?text=" + encodeURIComponent(user.first_name[0]);
    }
  } else {
    usernameElem.innerText = "Guest";
  }

  // Toggle name on click
  profilePic.addEventListener("click", () => {
    usernameElem.classList.toggle("hidden");
  });

  // === Tic Tac Toe Game ===
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
      return;
    }

    if (board.every(cell => cell)) {
      statusEl.textContent = "It's a draw!";
      gameOver = true;
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
    } else if (board.every(cell => cell)) {
      statusEl.textContent = "It's a draw!";
      gameOver = true;
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

  resetBtn.addEventListener("click", () => {
    board = Array(9).fill("");
    gameOver = false;
    statusEl.textContent = "Your move!";
    renderBoard();
  });

  renderBoard();
});