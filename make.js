import {
  debounce,
  DivstartGame,
  lose,
  Losemuen,
  pauseMue,
  showmine,
  timeOut,
  Win,
} from "./global.js";

const gameMaps = {
  easy: {
    layout: [
      [0,1,1,1,1,1,0],
      [0,0,1,1,1,0,0],
      [0,0,0,1,0,0,0]
    ],
    colors: ['#32CD32', '#90EE90', '#98FB98'],
    status: 1,
    time: 90,
    background: '#749478'
  },
  medium: {
    layout: [
      [1,1,1,1,1,1,1],
      [1,0,1,1,1,0,1],
      [1,1,1,0,1,1,1],
      [1,0,1,1,1,0,1],
      [1,1,1,1,1,1,1]
    ],
    colors: ['#FFD700', '#FFA500', '#FF8C00'],
    status: 1,
    time: 120,
    background: '#747474'
  },
  hard: {
    layout: [
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [1,1,0,0,0,1,1],
      [1,1,0,0,0,1,1],
      [1,1,0,0,0,1,1],
      [1,1,1,1,1,1,1]
    ],
    colors: ['#FF0000', '#DC143C', '#B22222'],
    status: 2,
    time: 120,
    background: '#000000'
  }
};

let currentMap = 'medium';
const MAX_ROWS = Math.max(...Object.values(gameMaps).map(map => map.layout.length));
const MAX_COLS = Math.max(...Object.values(gameMaps).map(map => map.layout[0].length));

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
let bricks = [];
let time = gameMaps[currentMap].time;
let lastTimeUpdate = 0;

function showTime(timestamp) {
  if (paused) return;

  if (timestamp - lastTimeUpdate >= 1000) {
    lastTimeUpdate = timestamp;
    const second = (time % 60).toString().padStart(2, "0");
    const minute = Math.floor(time / 60).toString().padStart(2, "0");
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

function getRandomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function initGame() {
  ballX = (gameContainer.clientWidth - (ball.clientWidth / 2)) / 2;
  ballY = gameContainer.clientHeight - paddle.clientHeight - ball.clientHeight - 3;
  ballSpeedX = -4;
  ballSpeedY = -4;
  paddleX = (gameContainer.clientWidth - paddle.clientWidth) / 2;
  paddle.style.transform = `translate(${paddleX}px, 0px)`;
  beforstart = true;
  updateScoreAndLives();
}

function Start() {
  const minue = document.getElementById("PusedMine");
  minue.innerHTML = DivstartGame;
  minue.style.display = "block";

  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const difficulty = btn.id.replace('Btn', '').toLowerCase();
      setMap(difficulty);
      minue.style.display = "none";
      minue.innerHTML = "";
      paused = false;
      beforstart = false;
    });
  });
}

function setMap(mapName) {
  currentMap = mapName;
  const map = gameMaps[mapName];
  time = map.time;
  gameContainer.style.backgroundColor = map.background;
  createBricks();
  Restart(false);
}

async function createBricks() {
  const map = gameMaps[currentMap];
  bricks = [];
  bricksContainer.innerHTML = "";
  
  totalStates = map.layout.reduce((total, row) => 
    total + row.reduce((rowTotal, cell) => rowTotal + (cell ? 1 : 0), 0), 0) * map.status;
  
  const brickWidth = bricksContainer.clientWidth * 0.1;
  const brickHeight = bricksContainer.clientHeight * 0.1;
  const spacingX = bricksContainer.clientWidth / 20;
  const spacingY = bricksContainer.clientWidth / 20;

  for (let r = 0; r < map.layout.length; r++) {
    bricks[r] = [];
    for (let c = 0; c < map.layout[r].length; c++) {
      if (map.layout[r][c] === 1) {
        const brick = document.createElement("div");
        brick.classList.add("brick");
        
        const offsetX = (bricksContainer.clientWidth - (map.layout[r].length * (brickWidth + spacingX))) / 2;
        const offsetY = (bricksContainer.clientHeight - (map.layout.length * (brickHeight + spacingY))) / 2;
        
        brick.style.left = (offsetX + c * (brickWidth + spacingX)) + "px";
        brick.style.top = (offsetY + r * (brickHeight + spacingY)) + "px";
        brick.style.width = brickWidth + "px";
        brick.style.height = brickHeight + "px";
        brick.style.backgroundColor = getRandomColor(map.colors);
        
        bricksContainer.appendChild(brick);
        bricks[r][c] = { 
          element: brick, 
          status: map.status, 
          last: false,
          react: brick.getBoundingClientRect()
        };
      } else {
        bricks[r][c] = null;
      }
    }
  }
}

async function updateScoreAndLives() {
  scoreDisplay.textContent = `Score: ${score}`;
  livesDisplay.textContent = `Lives: ${lives}`;
}

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
  if (e.key === "p" || e.key === "Escape") {
    if (!beforstart && lives > 0 && time > 0 && iswin !== totalStates) {
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

async function ReDraw() {
  bricks.forEach((row) => {
    row.forEach((brick) => {
      if (brick) {
        brick.element.style.display = "";
        brick.status = gameMaps[currentMap].status;
      }
    });
  });
}

function Restart() {
  initGame();
  ReDraw();
  lives = 3;
  score = 0;
  time = gameMaps[currentMap].time;
  const second = (time % 60).toString().padStart(2, "0");
  const minute = Math.floor(time / 60).toString().padStart(2, "0");
  divTime.innerText = `Time: ${minute}:${second}`;
  iswin = 0;
  updateScoreAndLives();
}

function handleKeyUp(e) {
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.key === "ArrowLeft") leftPressed = false;
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

async function drawBall() {
  ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
}

async function drawPaddle() {
  paddle.style.transform = `translate(${paddleX}px, 0px)`;
}

async function collisionDetection() {
  if (paused) return;
  bricks.forEach((row) => {
    row.forEach((brick) => {
      if (!brick || brick.status === 0) return;
      
      const brickPosition = brick.react;
      const ballPosition = ball.getBoundingClientRect();
      
      if (
        ballPosition.right >= brickPosition.left &&
        ballPosition.left <= brickPosition.right &&
        ballPosition.bottom >= brickPosition.top &&
        ballPosition.top <= brickPosition.bottom
      ) {
        if (brick.last) return;
        
        const overlapX = Math.min(
          ballPosition.right - brickPosition.left,
          brickPosition.right - ballPosition.left
        );
        const overlapY = Math.min(
          ballPosition.bottom - brickPosition.top,
          brickPosition.bottom - ballPosition.top
        );

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
        
        if (brick.status === 0) {
          brick.element.style.display = "none";
          iswin++;
        }
        
        if (iswin === totalStates) {
          lose(Win);
          paused = true;
        }
        return;
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
}

async function playGame() {
  const start = document.getElementById("start");
  if (!paused) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    if (ballX <= 0 || ballX + ball.clientWidth >= continarposition.width) {
      if (ballX < 0) {
        ballX = 0;
      } else if (ballX + ball.clientWidth > continarposition.width) {
        ballX = continarposition.width - ball.clientWidth;
      }
      ballSpeedX = -ballSpeedX;
    }
    if (ballY <= 0) ballSpeedY = -ballSpeedY;
    if (ballY + ball.clientHeight >= continarposition.height - position.height) {
      if (
        ballX + ball.clientWidth >= paddleX &&
        ballX <= paddleX + paddle.clientWidth
      ) {
        ballY = continarposition.height - position.height - ball.clientHeight;
        ballSpeedY = -ballSpeedY;

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

    if (rightPressed && paddleX + position.width < continarposition.width - 2)
      paddleX += speedBD;
    if (leftPressed && paddleX > 1) paddleX -= speedBD;
  } else if (beforstart && !start) {
    MoveBeforStart();
  }
}

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

initGame();
createBricks();
Start();
requestAnimationFrame(update);