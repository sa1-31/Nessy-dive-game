const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = Math.min(window.innerWidth, 420);
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// UI
const startMenu = document.getElementById("startMenu");
const touchHint = document.getElementById("touchHint");
const loseScreen = document.getElementById("loseScreen");
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const homeBtn = document.getElementById("homeBtn");

// Assets
const nessyImg = new Image();
nessyImg.src = "assets/nessy.png";

const orbImg = new Image();
orbImg.src = "assets/endless-logo.png";

const sharkImg = new Image();
sharkImg.src = "assets/shark.png";

// Game state
let gameRunning = false;
let gravity = 0.25;
let lift = -6;
let score = 0;

// Nessy
let nessy = {
  x: 80,
  y: canvas.height / 2,
  size: 64,
  velocity: 0
};

// Orb
let orb = {
  x: canvas.width + 200,
  y: randomY(),
  size: 40
};

// Shark
let shark = {
  x: canvas.width + 500,
  y: randomY(),
  size: 70
};

function randomY() {
  return Math.random() * (canvas.height - 120) + 60;
}

// Controls
function jump() {
  if (!gameRunning) {
    gameRunning = true;
    touchHint.classList.add("hidden");
  }
  nessy.velocity = lift;
}

window.addEventListener("click", jump);
window.addEventListener("touchstart", jump);
window.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

// Start
startBtn.onclick = () => {
  startMenu.classList.add("hidden");
  touchHint.classList.remove("hidden");
  resetGame();
};

// Retry
retryBtn.onclick = () => {
  loseScreen.classList.add("hidden");
  touchHint.classList.remove("hidden");
  resetGame();
};

// Home
homeBtn.onclick = () => {
  loseScreen.classList.add("hidden");
  startMenu.classList.remove("hidden");
};

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameRunning) {
    nessy.velocity += gravity;
    nessy.y += nessy.velocity;
  }

  // Draw Nessy
  ctx.drawImage(nessyImg, nessy.x, nessy.y, nessy.size, nessy.size);

  // Orb
  orb.x -= 3;
  if (orb.x < -orb.size) {
    orb.x = canvas.width + 200;
    orb.y = randomY();
  }
  ctx.drawImage(orbImg, orb.x, orb.y, orb.size, orb.size);

  // Shark
  shark.x -= 4;
  if (shark.x < -shark.size) {
    shark.x = canvas.width + 400;
    shark.y = randomY();
  }
  ctx.drawImage(sharkImg, shark.x, shark.y, shark.size, shark.size);

  // Collisions
  if (collide(nessy, orb)) {
    score++;
    orb.x = canvas.width + 200;
    orb.y = randomY();
  }

  if (collide(nessy, shark) || nessy.y + nessy.size > canvas.height) {
    lose();
  }

  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 12, 26);

  requestAnimationFrame(update);
}

function collide(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

function lose() {
  gameRunning = false;
  loseScreen.classList.remove("hidden");
}

function resetGame() {
  score = 0;
  gameRunning = false;
  nessy.y = canvas.height / 2;
  nessy.velocity = 0;
  orb.x = canvas.width + 200;
  shark.x = canvas.width + 400;
}

update();
