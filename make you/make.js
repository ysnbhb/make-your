const ball = document.getElementById("ball");
const paddle = document.getElementById("paddle");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const bricksContainer = document.getElementById("bricksContainer");

let ballX, ballY;
let ballSpeedX, ballSpeedY;
let paddleX;
let rightPressed, leftPressed;
let score;
let lives;

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
// function getRandomColor() {
//   const colors = ["#FF0000", "#0000FF", "#FFFF00", "#00FF00"];
//   return colors[Math.floor(Math.random() * colors.length)];
// }

function Init() {
  (ballX = 240), (ballY = 290);
  (ballSpeedX = 2), (ballSpeedY = -2);
  paddleX = 200;
  (rightPressed = false), (leftPressed = false);
  score = 0;
  lives = 3;
}

Init();

const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 70;
const brickHeight = 30;
const brickPadding = 30;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    const brick = document.createElement("div");
    brick.classList.add("brick");
    brick.style.left = c * (70 + 30) + "px";
    brick.style.top = r * (30 + 30) + "px";
    brick.style.backgroundColor = getRandomColor();
    brick.hitCount = 0;
    bricksContainer.appendChild(brick);
    bricks[c][r] = { element: brick, status: 1 };
  }
}

let puese = false;

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key == "i") puese = true;
  if (e.key == "y") puese = false;
});
document.addEventListener("keyup", function (e) {
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.key === "ArrowLeft") leftPressed = false;
});

function drawBall() {
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

function drawPaddle() {
  paddle.style.left = paddleX + "px";
}

function drawBricks() {
  bricks.forEach((col) => {
    col.forEach((brick) => {
      if (brick.status === 1) {
        brick.element.style.display = "block";
      } else {
        brick.element.style.display = "none";
      }
    });
  });
}

// let destroyedBricks = 0;
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          ballX + 20 > brick.element.offsetLeft &&
          ballX < brick.element.offsetLeft + 70 &&
          ballY + 20 > brick.element.offsetTop &&
          ballY < brick.element.offsetTop + 30
        ) {
          ballSpeedY = -ballSpeedY;
          brick.status = 0;
          score++;
          scoreDisplay.textContent = `Score: ${score}`;
          // ++vetess 17 brick
          //  if (destroyedBricks % 17 === 0) {
          //     ballSpeedX *= 1.0; // 10%
          //     ballSpeedY *= 1.0; // 10%
          // }
          ballSpeedX *= 1.001;
          ballSpeedY *= 1.001;
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }

          //     // frifyi jami3 zawaya ball
          // if (ballX + 20 > brick.element.offsetLeft && ballX < brick.element.offsetLeft + 60 &&
          //     ballY + 20 > brick.element.offsetTop && ballY < brick.element.offsetTop + 20) {
          //         // 3akse zawiyat ball
          //     if (ballY + 20 - ballSpeedY <= brick.element.offsetTop) {
          //         ballSpeedY = -ballSpeedY; // istidam mlfo9
          //     } else if (ballY - ballSpeedY >= brick.element.offsetTop + 20) {
          //         ballSpeedY = -ballSpeedY; // istidam mlthet
          //     } else {
          //         ballSpeedX = -ballSpeedX; // istidam men janibayn
          //     }

          //     brick.status = 0; // brick
          //     score++;
          //     scoreDisplay.textContent = `Score: ${score}`;

          //     if (score === brickRowCount * brickColumnCount) {
          //         alert("YOU WIN, CONGRATULATIONS!");
          //         document.location.reload();
          //     }
        }
      }
    }
  }
}

function Play() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  // tasadom jodran
  //   if (puese) return;
  if (ballX + ballSpeedX > 680 - 20 || ballX + ballSpeedX < 0)
    ballSpeedX = -ballSpeedX;
  if (ballY + ballSpeedY < 0) ballSpeedY = -ballSpeedY;
  // tasadom paddle
  else if (ballY + ballSpeedY > 500 - 20) {
    if (ballX + 20 > paddleX && ballX < paddleX + 100) {
      ballSpeedY = -ballSpeedY; // 3akes tijah ball

      // const deltaX = ballX - (paddleX + 37.5); // massafa ma3a centr paddle
      // ballSpeedX = deltaX * 0.2;

      const paddleCenter = paddleX + 50;
      const deltaX = ballX - paddleCenter;
      const angle = deltaX / 50; // 7isab zawiyat tasadom
      ballSpeedX = angle * 5;
    } else {
      lives--;
      livesDisplay.textContent = `Lives: ${lives}`;
      puese = true;
      Init();
      if (lives === 0) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        // dabet ball
        ballX = 240;
        ballY = 290;
        ballSpeedX = 6;
        ballSpeedY = -6;
        paddleX = 200;
      }
    }
  }
  // harakat paddle
  if (rightPressed && paddleX < 680 - 75) paddleX += 7;
  if (leftPressed && paddleX > 0) paddleX -= 7;
}

function update() {
  if (!puese) {
    Play();
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
  }
  requestAnimationFrame(update);
}

// setInterval(update, 10);
requestAnimationFrame(update);
