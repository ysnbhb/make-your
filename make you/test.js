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
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function IsWin() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) return false;
    }
  }
  return true;
}

// function getRandomColor() {
//   const colors = ["#FF0000", "#0000FF", "#FFFF00", "#00FF00"];
//   return colors[Math.floor(Math.random() * colors.length)];
// }

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
      brick.style.left = c * (brickWidth + brickPadding) + "px";
      brick.style.top = r * (brickHeight + brickPadding) + "px";
      brick.style.backgroundColor = getRandomColor();
      bricksContainer.appendChild(brick);
      const status = 1;
      bricks[c][r] = { element: brick, status: status };
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
      brick.element.style.display = brick.status !== 0 ? "block" : "none";
    });
  });
}

function collisionDetection() {
  const ballSize = 20; // Assume ball is 20x20 px
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      const position = brick.element.getBoundingClientRect();
      const positionBall = ball.getBoundingClientRect();
      if (brick.status !== 0) {
        const brickLeft = positionBall.left + ballSize;
        const brickRight = positionBall.right - ballSize;
        const brickTop = positionBall.top + ballSize;
        const brickBottom = positionBall.bottom - ballSize;

        // Check if ball collides with the current brick
        if (
          position.left <= brickLeft &&
          position.right >= brickRight &&
          position.top <= brickTop &&
          position.bottom >= brickBottom
        ) {
          // if (
          //   positionBall.bottom - ballSpeedY < position.top || // Coming from the top
          //   positionBall.top - ballSpeedY > position.bottom // Coming from below
          // ) {
          //   ballSpeedY = -ballSpeedY;
          // } else {
          //   ballSpeedX = -ballSpeedX;
          // }

          // console.log(ballSpeedY);

          // Reverse ball's vertical direction
          ballSpeedY = -ballSpeedY;
          // console.log(ballSpeedY);
          ballSpeedY *= 1.04;
          ballSpeedX *= 1.04;
          // Mark brick as destroyed
          brick.status -= 1;

          // Update score
          score++;
          updateScoreAndLives();

          // Gradually increase ball speed for challenge
          ballSpeedX *= 1.01;
          ballSpeedY *= 1.01;
          drawBricks();

          // Check for win condition
          // if (IsWin()) {
          //   alert("YOU WIN, CONGRATULATIONS!");
          //   document.location.reload();
          // }
          return;
        }
      }
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
  if (ballX < 0 || ballX + ball.clientWidth > continarposition.width)
    ballSpeedX = -ballSpeedX;
  else if (ballY < 0) ballSpeedY = -ballSpeedY;

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
  drawBall();
  drawPaddle();
  requestAnimationFrame(update);
}

// Start Game

initGame();
createBricks();
console.log(bricks);

requestAnimationFrame(update);
