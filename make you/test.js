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
const brickWidth = bricksContainer.clientWidth * 0.1;
const brickHeight = bricksContainer.clientHeight * 0.1;
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
      if (bricks[c][r].status > 0) return false;
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
  // console.log(paddleX);
  paddle.style.left = paddleX + "px";
  // score = 0;
  // createBricks();
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
      brick.style.left =
        c * (bricksContainer.clientWidth * 0.1 + brickPadding) + "px";
      brick.style.top =
        r * (bricksContainer.clientHeight * 0.1 + brickPadding) + "px";
      brick.style.backgroundColor = getRandomColor();
      bricksContainer.appendChild(brick);
      const status = 1;
      const last = false;
      bricks[c][r] = { element: brick, status: status, last: last };
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
      brick.element.style.display = brick.status !== 0 ? "bloclastk" : "none";
    });
  });
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      const brickPosition = brick.element.getBoundingClientRect();
      const ballPosition = ball.getBoundingClientRect();

      if (brick.status !== 0) {
        if (
          ballPosition.right >= brickPosition.left &&
          ballPosition.left <= brickPosition.right &&
          ballPosition.bottom >= brickPosition.top &&
          ballPosition.top <= brickPosition.bottom
        ) {
          if (brick.last) {
            return;
          }
          // Determine collision side based on overlap
          const overlapX = Math.min(
            ballPosition.right - brickPosition.left,
            brickPosition.right - ballPosition.left
          );
          const overlapY = Math.min(
            ballPosition.bottom - brickPosition.top,
            brickPosition.bottom - ballPosition.top
          );

          // Reverse ball direction based on the smaller overlap (more direct collision)
          if (overlapX < overlapY) {
            ballSpeedX = -ballSpeedX;
          } else {
            ballSpeedY = -ballSpeedY;
          }
          brick.status -= 1;
          score++;
          updateScoreAndLives();
          ballSpeedX *= 1.01;
          ballSpeedY *= 1.01;
          brick.last = true;

          if (IsWin()) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
          return;
        }
      }
      brick.last = false;
    }
  }
}

// Main Game Logic
function playGame() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  const position = paddle.getBoundingClientRect();
  const continarposition = gameContainer.getBoundingClientRect();
  // Wall Collision
  if (ballX <= 0 || ballX + ball.clientWidth >= continarposition.width)
    ballSpeedX = -ballSpeedX;
  if (ballY < 0) ballSpeedY = -ballSpeedY;

  // Paddle Collision
  if (ballY + ball.clientWidth >= continarposition.height - position.height) {
    if (ballX + ball.clientWidth >= paddleX && ballX < paddleX + 100) {
      ballSpeedY = -ballSpeedY;

      // Adjust ball angle based on paddle hit position
      const paddleCenter = paddleX + 50;
      const deltaX = ballX - paddleCenter;
      const angle = deltaX / 50;
      ballSpeedX = angle * 5;
    } else if (ballY + ball.clientWidth >= continarposition.height) {
      lives--;
      if (lives === 0) {
        alert("GAME OVER");
        paused = true;
        lives = 3;
        initGame();
        // document.location.reload();
      } else {
        paused = true;
        initGame();
      }
    }
  }

  // Paddle Movement
  if (rightPressed && paddleX <= continarposition.width - position.width - 2)
    paddleX += 7;
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
const test = document.getElementById("test");
function update() {
  test.innerText = (Number(test.innerText) + 1) % 100;
  if (!paused) {
    playGame();
    collisionDetection();
  }
  drawBricks();
  drawBall();
  drawPaddle();
  requestAnimationFrame(update);
}

// Start Game

initGame();
createBricks();
console.log(bricks);

requestAnimationFrame(update);
