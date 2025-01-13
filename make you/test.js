import {
  DivstartGame,
  lose,
  Losemuen,
  pauseMue,
  showmine,
  timeOut,
  Win,
} from "./global.js";

// DOM Elements
const ball = document.getElementById("ball");
const paddle = document.getElementById("paddle");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const bricksContainer = document.getElementById("bricksContainer");
const gameContainer = document.getElementById("gameContainer");
const divTime = document.getElementById("timer");

// Game Variables
const position = paddle.getBoundingClientRect();
const continarposition = gameContainer.getBoundingClientRect();

let ballX, ballY;
let ballSpeedX, ballSpeedY;
let paddleX;
let rightPressed = false,
  leftPressed = false;
let score = 0;
let lives = 3;
let paused = true;
let beforstart = true;
let totalStates = 0;
let iswin = 0;

const brickRowCount = 5;
const brickColumnCount = 7;
let bricks = [];
let time = 90;

let lastTimeUpdate = 0;

function showTime(timestamp) {
  if (paused) {
    requestAnimationFrame(showTime);
    return;
  }

  if (timestamp - lastTimeUpdate >= 1000) {
    lastTimeUpdate = timestamp;
    const second = (time % 60).toString().padStart(2, "0");
    const minute = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    divTime.innerText = `Time: ${minute}:${second}`;
    if (time === 0) {
      paused = true;
      lose(timeOut);
      return;
    }
    time--;
  }

  requestAnimationFrame(showTime);
}

requestAnimationFrame(showTime);

window.addEventListener("resize", () => {
  drawBricks();
});

function getRandomColor() {
  const colors = ["#FF0000", "#0000FF", "#FFFF00", "#00FF00"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function initGame() {
  ballX = gameContainer.clientWidth / 2;
  ballY = gameContainer.clientHeight - 40;
  ballSpeedX = -2;
  ballSpeedY = -2;
  paddleX = (gameContainer.clientWidth - paddle.clientWidth) / 2;
  paddle.style.left = paddleX + "px";
  beforstart = true;
  updateScoreAndLives();
}

function Start() {
  const start = document.getElementById("start");
  start.addEventListener("click", () => {
    const minue = document.getElementById("PusedMine");
    minue.style.display = "none";
    minue.innerHTML = "";
  });
}

// Create Bricks
async function createBricks() {
  bricks = [];
  bricksContainer.innerHTML = ""; // Clear previous bricks
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      const brick = document.createElement("div");
      brick.classList.add("brick");
      brick.style.left =
        c *
          (bricksContainer.clientWidth * 0.1 +
            bricksContainer.clientWidth / 20) +
        "px";
      brick.style.top =
        r *
          (bricksContainer.clientHeight * 0.1 +
            bricksContainer.clientWidth / 20) +
        "px";
      brick.style.backgroundColor = getRandomColor();
      bricksContainer.appendChild(brick);
      const status = 1;
      totalStates += status;
      const last = false;
      bricks[c][r] = { element: brick, status: status, last: last };
    }
  }
}

// Update Score and Lives Display
async function updateScoreAndLives() {
  scoreDisplay.textContent = `Score: ${score}`;
  livesDisplay.textContent = `Lives: ${lives}`;
}

// Handle Keyboard Input
function handleKeyDown(e) {
  const start = document.getElementById("start");
  if (e.key === "ArrowRight") {
    rightPressed = true;
    if (beforstart && !start) {
      MoveBeforStart();
    }
  }
  if (e.key === "ArrowLeft") {
    leftPressed = true;
  }
  if (e.key === " ") {
    if (beforstart && !start) {
      paused = !paused;
      beforstart = false;
    }
  }
  if (e.key == "p" || e.key == "Escape") {
    if (!beforstart && lives > 0 && time > 0 && iswin != totalStates) {
      paused = true;
      showmine(pauseMue);
    }
  }
}

function MoveBeforStart() {
  const continarposition = gameContainer.getBoundingClientRect();
  const position = paddle.getBoundingClientRect();

  if (rightPressed && paddleX <= continarposition.width - position.width - 2) {
    paddleX += 7;
    ballX += 7;
  }
  if (leftPressed && paddleX > 1) {
    paddleX -= 7;
    ballX -= 7;
  }
}

export function Continue(minue) {
  const div = document.getElementById("Continue");
  div.addEventListener("click", () => {
    minue.style.display = "none";
    paused = false;
  });
}

// function Test() {
//   test.innerText = (Number(test.innerText) + 1) % 100;
//   requestAnimationFrame(Test);
// }

// requestAnimationFrame(Test);

export function RestartBtn(minue) {
  const div = document.getElementById("Restart");
  div.addEventListener("click", () => {
    // minue.style.display = "none";
    Restart();

    minue.innerHTML = DivstartGame;
    Start();
  });
}

function Restart() {
  initGame();
  createBricks();
  lives = 3;
  score = 0;
  time = 90;
  const second = (time % 60).toString().padStart(2, "0");
  const minute = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  divTime.innerText = `Time: ${minute}:${second}`;
  totalStates = 0;
  iswin = 0;
  // drawBricks();
  updateScoreAndLives();
}

function handleKeyUp(e) {
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.key === "ArrowLeft") leftPressed = false;
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Draw Ball
async function drawBall() {
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

// Draw Paddle
async function drawPaddle() {
  paddle.style.left = paddleX + "px";
}

// Draw Bricks
async function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      const c = brick.element.dataset.column;
      const r = brick.element.dataset.row;
      const xOffset =
        c *
        (bricksContainer.clientWidth * 0.1 + bricksContainer.clientWidth / 20);
      const yOffset =
        r *
        (bricksContainer.clientHeight * 0.1 + bricksContainer.clientWidth / 20);
      brick.element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      brick.element.style.display = brick.status !== 0 ? "block" : "none";
    });
  });
}

async function collisionDetection() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
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
          ballSpeedX *= 1.01;
          ballSpeedY *= 1.01;
          brick.last = true;
          iswin++;
          drawBricks();
          // drawBricks();
          if (iswin == totalStates) {
            lose(Win);
            paused = true;
          }
          return;
        }
      }
      brick.last = false;
    });
  });
}

const fpsDisplay = document.createElement("div");
fpsDisplay.style.position = "fixed";
fpsDisplay.style.top = "10px";
fpsDisplay.style.left = "10px";
fpsDisplay.style.color = "white";
fpsDisplay.style.background = "black";
fpsDisplay.style.padding = "5px";
fpsDisplay.style.fontFamily = "Arial";
document.body.appendChild(fpsDisplay);
let lastFrameTime = performance.now();
let fps = 0;

function calculateFPS(now) {
  const elapsedTime = (now - lastFrameTime) / 1000;

  fps = 1 / elapsedTime;
  fpsDisplay.innerText = `FPS: ${Math.round(fps)}`;
  lastFrameTime = now;
  requestAnimationFrame(calculateFPS);
}
calculateFPS();

// Main Game Logic
async function playGame() {
  const start = document.getElementById("start");
  if (!paused) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    // Wall Collision
    if (ballX <= 0 || ballX + ball.clientWidth >= continarposition.width) {
      if (ballX < 0) {
        ballX = 0;
      } else if (ballX + ball.clientWidth > continarposition.width) {
        ballX = continarposition.width - ball.clientWidth;
      }
      ballSpeedX = -ballSpeedX;
    }
    if (ballY <= 0) ballSpeedY = -ballSpeedY;

    // Paddle Collision
    if (ballY + ball.clientWidth >= continarposition.height - position.height) {
      if (
        ballX + ball.clientWidth >= paddleX &&
        ballX < paddleX + paddle.clientWidth
      ) {
        ballSpeedY = -ballSpeedY;

        // Adjust ball angle based on paddle hit position
        const paddleCenter = paddleX + 50;
        const deltaX = ballX - paddleCenter;
        const angle = deltaX / 50;
        ballSpeedX = angle * 5;
      } else if (ballY + ball.clientWidth >= continarposition.height) {
        lives--;
        paused = true;
        if (lives === 0) {
          lose(Losemuen);
        } else {
          initGame();
        }
      }
    }

    // Paddle Movement
    if (rightPressed && paddleX <= continarposition.width - position.width - 2)
      paddleX += 7;
    if (leftPressed && paddleX > 1) paddleX -= 7;
  } else if (beforstart && !start) {
    MoveBeforStart();
  }
}

// Game Update Loop
function update() {
  playGame();
  collisionDetection();
  updateScoreAndLives();
  drawBall();
  drawPaddle();
  requestAnimationFrame(update);
}

// Start Game
initGame();
createBricks();
Start();
requestAnimationFrame(update);
