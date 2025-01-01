// DOM Elements
const ball = document.getElementById("ball");
const paddle = document.getElementById("paddle");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const bricksContainer = document.getElementById("bricksContainer");
const gameContainer = document.getElementById("gameContainer");
// Game Variables
let ballX, ballY;
let ballSpeedX, ballSpeedY;
let paddleX;
let rightPressed = false,
  leftPressed = false;
let score = 0;
let lives = 3;
let paused = true;

const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 70;
const brickHeight = 30;
const brickPadding = 30;
let bricks = [];

// Utility Function: Generate Random Colors
// function getRandomColor() {
//   const letters = "0123456789ABCDEF";
//   let color = "#";
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

function IsWin() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) return false;
    }
  }
  return true;
}

function getRandomColor() {
  const colors = ["#FF0000", "#0000FF", "#FFFF00", "#00FF00"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize Game State
function initGame() {
  ballX = gameContainer.clientWidth / 2;
  ballY = gameContainer.clientHeight - 40;
  ballSpeedX = 2;
  ballSpeedY = -2;
  paddleX = (gameContainer.clientWidth - paddle.clientWidth) / 2;
  console.log(paddleX);
  paddle.style.left = paddleX + "px";
  score = 0;
  createBricks();
  updateScoreAndLives();
}

// Create Bricks
function createBricks() {
  bricks = [];
  bricksContainer.innerHTML = ""; // Clear previous bricks

  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      const brick = document.createElement("div");
      brick.classList.add("brick");
      brick.style.left = c * (brickWidth + brickPadding) + "px";
      brick.style.top = r * (brickHeight + brickPadding) + "px";
      brick.style.backgroundColor = getRandomColor();
      bricksContainer.appendChild(brick);
      bricks[c][r] = { element: brick, status: 1 };
    }
  }
}

// Update Score and Lives Display
function updateScoreAndLives() {
  scoreDisplay.textContent = `Score: ${score}`;
  livesDisplay.textContent = `Lives: ${lives}`;
}

// Handle Keyboard Input
function handleKeyDown(e) {
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === " ") paused = !paused;
}

function handleKeyUp(e) {
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.key === "ArrowLeft") leftPressed = false;
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Draw Ball
function drawBall() {
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

// Draw Paddle
function drawPaddle() {
  paddle.style.left = paddleX + "px";
}

// Draw Bricks
function drawBricks() {
  bricks.forEach((col) => {
    col.forEach((brick) => {
      brick.element.style.display = brick.status === 1 ? "block" : "none";
    });
  });
}

// Collision Detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          ballX + 20 > brick.element.offsetLeft &&
          ballX < brick.element.offsetLeft + brickWidth &&
          ballY + 20 > brick.element.offsetTop &&
          ballY < brick.element.offsetTop + brickHeight
        ) {
          ballSpeedY = -ballSpeedY;
          brick.status = 0;
          score++;
          updateScoreAndLives();
          // Increase ball speed slightly for challenge
          ballSpeedX *= 1.01;
          ballSpeedY *= 1.01;

          if (IsWin()) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Main Game Logic
function playGame() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Wall Collision
  if (ballX + ballSpeedX > 680 - 20 || ballX + ballSpeedX < 0)
    ballSpeedX = -ballSpeedX;
  if (ballY + ballSpeedY < 0) ballSpeedY = -ballSpeedY;

  // Paddle Collision
  if (ballY + ballSpeedY > 500 - 20) {
    if (ballX + 20 > paddleX && ballX < paddleX + 100) {
      ballSpeedY = -ballSpeedY;

      // Adjust ball angle based on paddle hit position
      const paddleCenter = paddleX + 50;
      const deltaX = ballX - paddleCenter;
      const angle = deltaX / 50;
      ballSpeedX = angle * 5;
    } else {
      // Lose a life
      lives--;
      createBricks();
      updateScoreAndLives();

      if (lives === 0) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        paused = true;
        initGame();
      }
    }
  }

  // Paddle Movement
  if (rightPressed && paddleX < 680 - 104) paddleX += 7;
  if (leftPressed && paddleX > 1) paddleX -= 7;
}

// Reset Ball and Paddle Position
// function resetBallAndPaddle() {
//   ballX = 240;
//   ballY = 290;
//   ballSpeedX = 2;
//   ballSpeedY = -2;
//   paddleX = 200;
// }

// Game Update Loop
function update() {
  if (!paused) {
    playGame();
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
  }
  requestAnimationFrame(update);
}

// Start Game
drawBall();
drawPaddle();
drawBricks();
initGame();
requestAnimationFrame(update);
