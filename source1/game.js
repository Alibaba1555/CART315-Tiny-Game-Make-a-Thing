import TileMap from "./TileMap.js";

const tileSize = 32; // Each square is 32px
const velocity = 2; //pacman moving distance / speed

const canvas = document.getElementById('gameCanvas'); // connect with game Canvas
const ctx = canvas.getContext('2d'); //2d instead of 3d
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity); //create pacman 

const enemies = tileMap.getEnemies(velocity); // create ghosts

// Begin the game
let gameOver = false; // stat of the game is not gameOver
let gameWin = false; // stat of the game is not gameWin
const gameOverSound = new Audio("sounds1/gameOver.wav");
const gameWinSound = new Audio("sounds1/gameWin.wav");

// redraw the screen a certain number of time per second
function gameLoop() {
    tileMap.draw(ctx); // Draw the tilemap\
    drawGameEnd();
    pacman.draw(ctx, pause(), enemies); // keep drawing the pacman and pass it to ctx value / otherwise pause / eat a ghost
    enemies.forEach((enemy) => enemy.draw(ctx,pause(), pacman));
    
    checkGameOver();  // check if its game over
    checkGameWin();  // check if its game win
}

// check if the game win
function checkGameWin() {
    if (!gameWin) {
      gameWin = tileMap.didWin(); // Call the tileMapto check if the codition for game win is true
      if (gameWin) {
        gameWinSound.play(); // play the game win sound
      }
    }
  }

// check if the game is over
function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}

function isGameOver() {
  return enemies.some(
    // check if the power dot is active and if there is a collide between enemies and pacman
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

// Pause the game if Pacman did not start the game / game over or game win
function pause() {
    return !pacman.madeFirstMove || gameOver || gameWin; 
  }

// Game over function
function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = " You Win!"; // Default message for game win
    if (gameOver) {
      text = "Game Over"; // Change message if the game is lost
    }

    // art style 
    ctx.font = "50px 'Press Start 2P', sans-serif"; // Retro pixel font
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = 50; // Approximate height of the font
    const padding = 20; // Padding around the text

    // Calculate the size and position of the black rectangle (behind the message)
    const rectWidth = textWidth + padding * 2;
    const rectHeight = textHeight + padding * 2;
    const rectX = (canvas.width - rectWidth) / 2;
    const rectY = (canvas.height - rectHeight) / 2;

     // Draw the black rectangle for the message
     ctx.fillStyle = "black";
     ctx.fillRect(rectX, rectY, rectWidth, rectHeight);


     ctx.fillStyle = "#FFD700"; // Gold-like color for retro effect

     // Center the text horizontally and vertically
     const textX = (canvas.width - textWidth) / 2; // Center horizontally
     const textY = (canvas.height + textHeight) / 2; // Center vertically (adjust for baseline)
     
     // Draw the text at the center of the canvas
     ctx.fillText(text, textX, textY);
     
     // Add a shadow effect for extra retro flair
     ctx.shadowColor = "#FF4500"; // Orange shadow
     ctx.shadowBlur = 15;
  }
}

tileMap.setCanvasSize(canvas);
// Divide 1000 milliseconds by 75 so that we can call this function 75 times per second.
setInterval(gameLoop, 1000 / 75);