const size = 4;
const tileSize = 80;
let board = [];
let score = 0;

const tilesEl = document.getElementById("tiles");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");

function init() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  overlay.style.display = "none";
  addTile();
  addTile();
  render();
}

function addTile() {
  const empty = [];
  board.forEach((row, r) =>
    row.forEach((v, c) => v === 0 && empty.push({ r, c }))
  );
  if (!empty.length) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  tilesEl.innerHTML = "";
  board.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value !== 0) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.value = value;
        tile.textContent = value;
        tile.style.transform = `translate(${c * tileSize}px, ${r * tileSize}px)`;
        tilesEl.appendChild(tile);
      }
    });
  });
  scoreEl.textContent = score;
}

function slide(row) {
  let arr = row.filter(v => v);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
      if (arr[i] === 2048) win();
    }
  }
  arr = arr.filter(v => v);
  while (arr.length < size) arr.push(0);
  return arr;
}

function rotate() {
  board = board[0].map((_, i) => board.map(row => row[i]));
}

function moveLeft() { board = board.map(row => slide(row)); }
function moveRight() { board = board.map(row => slide(row.reverse()).reverse()); }
function moveUp() { rotate(); moveLeft(); rotate(); }
function moveDown() { rotate(); moveRight(); rotate(); }

function canMove() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return true;
      if (c < size - 1 && board[r][c] === board[r][c + 1]) return true;
      if (r < size - 1 && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
}

function win() {
  overlay.textContent = "Você ganhou o jogo";
  overlay.style.opacity = 0;
  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.style.transition = "opacity 1s";
    overlay.style.opacity = 1;
  }, 10);
}

function lose() {
  overlay.textContent = "Você perdeu o jogo!";
  overlay.style.opacity = 0;
  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.style.transition = "opacity 1s";
    overlay.style.opacity = 1;
  }, 10);
}

document.addEventListener("keydown", e => {
  const old = JSON.stringify(board);

  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === "ArrowUp") moveUp();
  if (e.key === "ArrowDown") moveDown();

  if (JSON.stringify(board) !== old) {
    addTile();
    render();
    if (!canMove()) lose();
  }
});

//Bloquear scroll da página web
window.addEventListener("keydown", function(e){
  const keysBlocks = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if(keysBlocks.includes(e.key)) {
    e.preventDefault();
  }
})

init();