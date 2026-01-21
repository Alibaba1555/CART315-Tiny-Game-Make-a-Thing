import TileMap from "./TileMap.js";

const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;

const gameOverSound = new Audio("sounds1/gameOver.wav");
const gameWinSound = new Audio("sounds1/gameWin.wav");

function gameLoop() {
  tileMap.draw(ctx);
  drawHud();
  drawGameEnd();
  drawStartHint();

  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));

  checkGameOver();
  checkGameWin();
}


function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) gameWinSound.play();
  }
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) gameOverSound.play();
  }
}

function isGameOver() {
  return enemies.some((enemy) => !pacman.powerDotActive && enemy.collideWith(pacman));
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawStartHint() {
  if (pacman.madeFirstMove || gameOver || gameWin) return;

  const text = "Click to start";
  ctx.font = "26px 'Press Start 2P', sans-serif";
  const w = ctx.measureText(text).width;

  ctx.fillStyle = "black";
  ctx.fillRect((canvas.width - w) / 2 - 20, canvas.height / 2 - 60, w + 40, 80);

  ctx.fillStyle = "#FFD700";
  ctx.shadowColor = "#FF4500";
  ctx.shadowBlur = 12;
  ctx.fillText(text, (canvas.width - w) / 2, canvas.height / 2);
  ctx.shadowBlur = 0;
}

function drawGameEnd() {
  if (!gameOver && !gameWin) return;

  const text = gameOver ? "Game Over" : "You Win!";
  ctx.font = "50px 'Press Start 2P', sans-serif";

  const textWidth = ctx.measureText(text).width;
  const textHeight = 50;
  const padding = 20;

  const rectWidth = textWidth + padding * 2;
  const rectHeight = textHeight + padding * 2;
  const rectX = (canvas.width - rectWidth) / 2;
  const rectY = (canvas.height - rectHeight) / 2;

  ctx.fillStyle = "black";
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

  ctx.fillStyle = "#FFD700";
  ctx.shadowColor = "#FF4500";
  ctx.shadowBlur = 15;

  const textX = (canvas.width - textWidth) / 2;
  const textY = (canvas.height + textHeight) / 2;
  ctx.fillText(text, textX, textY);

  ctx.shadowBlur = 0;
}

canvas.addEventListener("click", (e) => {
  if (!pacman.madeFirstMove && !gameOver && !gameWin) {
    pacman.madeFirstMove = true;
    return;
  }

  if (gameOver || gameWin) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const col = Math.floor(x / tileSize);
  const row = Math.floor(y / tileSize);

  tileMap.tryEditWall(row, col);
});

tileMap.setCanvasSize(canvas);

function drawHud() {
  ctx.save();
  ctx.font = "14px 'Press Start 2P', sans-serif";
  ctx.fillStyle = "#FFD700";
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 6;

  ctx.fillText(`WALLS: ${tileMap.wallStock}`, 10, 24);

  ctx.shadowBlur = 0;
  ctx.restore();
}

setInterval(gameLoop, 1000 / 75);
