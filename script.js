const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = Math.min(window.innerWidth, 420);
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Assets
const nessyImg = new Image();
nessyImg.src = "assets/nessy.png";

const orbImg = new Image();
orbImg.src = "assets/endless-logo.png";

// Game objects
let nessy = {
  x: 80,
  y: canvas.height / 2,
  size: 64,
  velocity: 0
};

let orb = {
  x: canvas.width + 100,
  y: Math.random() * (canvas.height - 80) + 40,
  size: 40
};

let gravity = 0.5;
let lift = -8;
let score = 0;

// Controls (mobile + PC)
function jump() {
  nessy.velocity = lift;
}

window.addEventListener("click", jump);
window.addEventListener("touchstart", jump);
window.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Nessy physics
  nessy.velocity += gravity;
  nessy.y += nessy.velocity;

  if (nessy.y < 0) nessy.y = 0;
  if (nessy.y + nessy.size > canvas.height) {
    resetGame();
  }

  // Orb movement
  orb.x -= 3;
  if (orb.x < -orb.size) {
    resetOrb();
  }

  // Collision
  if (
    nessy.x < orb.x + orb.size &&
    nessy.x + nessy.size > orb.x &&
    nessy.y < orb.y + orb.size &&
    nessy.y + nessy.size > orb.y
  ) {
    score++;
    resetOrb();
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.drawImage(nessyImg, nessy.x, nessy.y, nessy.size, nessy.size);
  ctx.drawImage(orbImg, orb.x, orb.y, orb.size, orb.size);

  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 12, 28);
}

function resetOrb() {
  orb.x = canvas.width + 80;
  orb.y = Math.random() * (canvas.height - 80) + 40;
}

function resetGame() {
  score = 0;
  nessy.y = canvas.height / 2;
  nessy.velocity = 0;
  resetOrb();
}

update();
