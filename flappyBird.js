const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

function resizeCanvas() {
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let gameOver = false;

const restartDiv = document.getElementById("restartScreen");

// ---------- GLOBAL GAME CONFIG ----------

const GAME = {
  gravity: 1.6,
  gap: cvs.height * 0.25,
  pipeSpeed: 2,
};

const BIRD = {
  x: cvs.width * 0.2,
  y: cvs.height * 0.4,
  width: 100,
  height: 70,
  jump: 35,
};

const PIPE = {
  width: 80,
  height: cvs.height * 0.6,
};

// ---------- LOAD IMAGES ----------

const birdImg = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

birdImg.src = "images/main.png";
bg.src = "images/hell.jpg";
fg.src = "images/hellroad.jpg";
pipeNorth.src = "images/image.png";
pipeSouth.src = "images/image.png";

// ---------- AUDIO ----------

const fly = new Audio("sounds/faaah.mp3");
// const scoreSound = new Audio("sounds/score.mp3");
const hit = new Audio("sounds/meri-jung-emotional.mp3");

// ---------- INPUT ----------
function jump() {
  BIRD.y -= BIRD.jump;
  fly.currentTime = 0;
  fly.play();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

document.addEventListener("touchstart", () => {
  jump();
});
// ---------- PIPES ----------

let pipes = [
  {
    x: cvs.width,
    y: -150,
  },
];

let score = 0;

// ---------- DRAW LOOP ----------

function restartGame(){

  pipes = [{
    x: cvs.width,
    y: -150
  }];

  BIRD.y = cvs.height * 0.4;
  score = 0;
  gameOver = false;

  restartDiv.style.display = "none";

  draw();
}

function draw() {
  ctx.drawImage(bg, 0, 0, cvs.width, cvs.height);

  for (let i = 0; i < pipes.length; i++) {
    let constant = PIPE.height + GAME.gap;

    ctx.drawImage(pipeNorth, pipes[i].x, pipes[i].y, PIPE.width, PIPE.height);

    ctx.drawImage(
      pipeSouth,
      pipes[i].x,
      pipes[i].y + constant,
      PIPE.width,
      PIPE.height,
    );

    pipes[i].x -= GAME.pipeSpeed;

    if (pipes[i].x === 80) {
      pipes.push({
        x: cvs.width,
        y: -Math.random() * PIPE.height * 0.7,
      });
    }

    // collision

    if (
      BIRD.x + BIRD.width >= pipes[i].x &&
      BIRD.x <= pipes[i].x + PIPE.width &&
      (BIRD.y <= pipes[i].y + PIPE.height ||
        BIRD.y + BIRD.height >= pipes[i].y + constant)
    ) {
      hit.play();
      gameOver = true;
      restartDiv.style.display = "flex";
    }

    if (pipes[i].x === 5) {
      score++;
      //   scoreSound.play();
    }
  }

  ctx.drawImage(fg, 0, cvs.height - 100, cvs.width, 100);

  ctx.drawImage(birdImg, BIRD.x, BIRD.y, BIRD.width, BIRD.height);

  BIRD.y += GAME.gravity;

  ctx.fillStyle = "#000";
  ctx.font = "20px Verdana";
  ctx.fillText("Score: " + score, 10, cvs.height - 20);

  if(!gameOver){
  requestAnimationFrame(draw);
}
}

draw();
