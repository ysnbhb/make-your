import {
  anon,
  debounce,
  DivstartGame,
  lose,
  Losemuen,
  message,
  message1,
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
const continarposition = gameContainer.getBoundingClientRect();
const position = paddle.getBoundingClientRect();
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
const speedBD = 9;
const brickRowCount = 3;
const brickColumnCount = 7;
let bricks = [];
let time = 90;

let lastTimeUpdate = 0;

function showTime(timestamp) {
  if (paused) {
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
}

window.addEventListener(
  "resize",
  debounce(() => {
    window.location.reload();
  }, 200)
);

function getRandomColor() {
  const colors = ["#FF0000", "#0000FF", "#FFFF00", "#00FF00"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function initGame() {
  ballX = (gameContainer.clientWidth - ball.clientWidth / 2) / 2;
  ballY =
    gameContainer.clientHeight - paddle.clientHeight - ball.clientHeight - 3;
  ballSpeedX = -3;
  ballSpeedY = -3;
  paddleX = (gameContainer.clientWidth - paddle.clientWidth) / 2;
  paddle.style.transform = `translate(${paddleX}px, 0px)`;
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
      const x =
        c *
        (bricksContainer.clientWidth * 0.1 + bricksContainer.clientWidth / 20);
      const y =
        r *
        (bricksContainer.clientHeight * 0.1 + bricksContainer.clientWidth / 20);
      brick.style.transform = `translate(${x}px, ${y}px)`;
      const color = getRandomColor();
      brick.style.backgroundColor = color;
      bricksContainer.appendChild(brick);
      const status = 1;
      totalStates += status;
      const last = false;
      const react = brick.getBoundingClientRect();
      bricks[c][r] = {
        element: brick,
        status: status,
        last: last,
        react: react,
      };
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
  if (rightPressed && paddleX <= continarposition.width - position.width - 2) {
    paddleX += speedBD;
    ballX += speedBD;
  }
  if (leftPressed && paddleX > 1) {
    paddleX -= speedBD;
    ballX -= speedBD;
  }
}

export function Continue(minue) {
  const div = document.getElementById("Continue");
  div.addEventListener("click", () => {
    minue.style.display = "none";
    paused = false;
  });
}

export function RestartBtn(minue) {
  const div = document.getElementById("Restart");
  div.addEventListener("click", () => {
    Restart();
    minue.innerHTML = DivstartGame;
    Start();
  });
}

function Restart() {
  createBricks();
  initGame();
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
  ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
}

// Draw Paddle
async function drawPaddle() {
  paddle.style.transform = `translate(${paddleX}px, 0px)`;
}

let firstCollision = true;

async function collisionDetection() {
  if (paused) return;
  bricks.forEach((column) => {
    column.forEach((brick) => {
      const brickPosition = brick.react;
      const ballPosition = ball.getBoundingClientRect();
      if (brick.status !== 0) {
        if (
          ballPosition.right + ballSpeedX >= brickPosition.left &&
          ballPosition.left + ballSpeedX <= brickPosition.right &&
          ballPosition.bottom + ballSpeedY >= brickPosition.top &&
          ballPosition.top + ballSpeedY <= brickPosition.bottom
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
          if (brick.status == 0) {
            brick.element.remove();
          }
          iswin++;
          if (iswin == totalStates) {
            lose(Win);
            paused = true;
          }
          if (firstCollision) {
            firstCollision = false;
            paused = true;
            beforstart = true;
            anon(message);
          }
          return;
        }
      }
      brick.last = false;
    });
  });
}

const fpsDisplay = document.getElementById("fps");

let lastFrameTime = performance.now();
let fps = 0;

function calculateFPS(now) {
  const elapsedTime = (now - lastFrameTime) / 1000;

  fps = 1 / elapsedTime;
  fpsDisplay.innerText = `FPS: ${Math.round(fps)}`;
  lastFrameTime = now;
}

let hitPaddleOnce = true;
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
    if (
      ballY + ball.clientHeight + ballSpeedY >
      continarposition.height - position.height - 3
    ) {
      if (
        ballX + ball.clientHeight >= paddleX &&
        ballX <= paddleX + paddle.clientWidth
      ) {
        if (hitPaddleOnce) {
          hitPaddleOnce = false;
          paused = true;
          beforstart = true;
          // await showHitPaddleStory();
          anon(message1);
        }
        ballY = continarposition.height - position.height - ball.clientHeight;
        ballSpeedY = -ballSpeedY;

        // Adjust ball angle based on paddle hit position
        const paddleCenter = paddleX + paddle.clientWidth / 2;
        const deltaX = ballX - paddleCenter;
        const angle = deltaX / (paddle.clientWidth / 2);
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
    if (
      rightPressed &&
      paddleX + position.width + speedBD <= continarposition.width
    )
      paddleX += speedBD;
    if (leftPressed && paddleX > 1) paddleX -= speedBD;
  } else if (beforstart && !start) {
    MoveBeforStart();
  }
}

// Game Update Loop
function update(now) {
  showTime(now);
  calculateFPS(now);
  playGame();
  collisionDetection();
  updateScoreAndLives();
  drawBall();
  drawPaddle();
  requestAnimationFrame(update);
}

// Start Game
initGame();
console.log(ballX, ballY);

createBricks();
Start();
update();
