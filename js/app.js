const dino = document.getElementById("dino-box");
const cactus = document.getElementById("cactus-box");
const cactusImg = document.querySelector(".cactus-img");
const dinoImg = document.querySelector(".dino-img");
const cloud1 = document.querySelector(".cloud1-box");
const cloudImg1 = document.querySelector(".cloud1");
const cloud2 = document.querySelector(".cloud2-box");
const cloudImg2 = document.querySelector(".cloud2");
const cloud3 = document.querySelector(".cloud3-box");
const cloudImg3 = document.querySelector(".cloud3");
const jumpSound = new Audio("./audio/jump_sound.mp3");
const hitSound = new Audio("./audio/hit_sound.mp3");
const scoreSound = new Audio("./audio/score_sound.mp3");
const scoreDisplay = document.querySelector(".score");
const countScore = document.querySelector(".count-score");
const scoreDigits = document.querySelector(".score-digits");
const gameDisplay = document.getElementById("game");
const gameOver = document.querySelector(".game-over");
const reloadBtn = document.getElementById("reload-btn");

function nightMode() {
  gameDisplay.style.transition = "2s all linear";
  gameDisplay.style.transitionDuration = "2s";
  gameDisplay.style.backgroundColor = "black";
  gameDisplay.style.borderBottom = "2px dotted white";
  dinoImg.style.filter =
    "invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)";
  cactusImg.style.filter =
    "invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)";
  scoreDisplay.style.color = "white";
  cloudImg1.src = "./img/stars.png";
  cloudImg1.style.filter =
    "invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)";
  cloudImg2.src = "./img/moon.png";
  cloudImg2.style.filter =
    "invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)";
  cloudImg3.src = "./img/stars.png";
  cloudImg3.style.filter =
    "invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)";
  document.querySelector(".game-over h3").style.color = "white";
  reloadBtn.style.backgroundImage = "url('/img/reload-btn2.png')";
  reloadBtn.style.width = "40px";
  reloadBtn.style.height = "35px";
}

function dayMode() {
  gameDisplay.style.transition = "2s all linear";
  gameDisplay.style.transitionDuration = "2s";
  gameDisplay.style.backgroundColor = "white";
  gameDisplay.style.borderBottom = "1px solid black";
  dinoImg.style.filter = "none";
  cactusImg.style.filter = "none";
  scoreDisplay.style.color = "black";
  cloudImg1.src = "./img/cloud.png";
  cloudImg1.style.filter = "none";
  cloudImg2.src = "./img/cloud.png";
  cloudImg2.style.filter = "none";
  cloudImg3.src = "./img/cloud.png";
  cloudImg3.style.filter = "none";
  document.querySelector(".game-over h3").style.color = "black";
  reloadBtn.style.backgroundImage = "url('/img/reload-btn.png')";
}

function jump() {
  if (dino.classList != "jump") {
    dino.classList.add("jump");
    dinoImg.src = "./img/dino_idle.gif";

    setTimeout(() => {
      dino.classList.remove("jump");
      cactus.classList.add("cactus-active");

      dinoImg.src = "./img/dino_run.gif";
      cloud1.style.animation = "clouds 30s linear infinite";
      cloud2.style.animation = "clouds 30s linear 5s infinite";
      cloud3.style.animation = "clouds 30s linear 15s infinite";
    }, 500);
  }
}

function checkEncounter() {
  // Get current dino Y position
  const dinoTop = parseInt(
    window.getComputedStyle(dino).getPropertyValue("top")
  );

  // Get current cactus X position
  const cactusLeft = parseInt(
    window.getComputedStyle(cactus).getPropertyValue("left")
  );

  // Detect encounter
  if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
    gameOver.style.display = "block";
    hitSound.play();
    setTimeout(() => {
      if (!hitSound.loop) {
        hitSound.muted = true;
      }
    }, 200);
    dinoImg.src = "./img/dino_hit.png";
    cloud1.style.animationPlayState = "paused";
    cloud2.style.animationPlayState = "paused";
    cloud3.style.animationPlayState = "paused";
    cactus.style.animationPlayState = "paused";
  }
}

setInterval(checkEncounter, 100);

function scoreCounter() {
  let score = 0;

  window.addEventListener("keydown", duckMove);
  window.addEventListener("keyup", normalizeDuck);

  let scoreIncrement = function () {
    countScore.innerHTML = score;

    const dinoTop = parseInt(
      window.getComputedStyle(dino).getPropertyValue("top")
    );

    const cactusLeft = parseInt(
      window.getComputedStyle(cactus).getPropertyValue("left")
    );

    if (
      score === 99_999 ||
      (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140)
    ) {
      clearInterval(this);
      gameDisplay.removeEventListener("click", jumpMoveMobile);
      window.removeEventListener("keydown", jumpMove);
      window.removeEventListener("keydown", duckMove);
      window.removeEventListener("keyup", normalizeDuck);
    } else {
      score++;
    }

    if (score === 10) {
      scoreDigits.innerHTML = "000";
    }
    if (score === 100) {
      scoreDigits.innerHTML = "00";
    }
    if (score === 1_000) {
      scoreDigits.innerHTML = "0";
    }
    if (score === 10_000) {
      scoreDigits.style.display = "none";
    }

    if (score % 50 === 0) {
      scoreDisplay.classList.remove("new-target");
    }

    if (score % 100 === 0) {
      scoreSound.play();
      scoreDisplay.classList.add("new-target");
    }

    if (score % 500 === 0) {
      nightMode();
    }

    if (score % 1_000 === 0) {
      dayMode();
    }
  };

  setInterval(scoreIncrement, 100);
}

const mql = window.matchMedia("(max-width: 1399.98px)");

if (mql.matches) {
  // For Mobile Gameplay
  function jumpMoveMobile() {
    jump();
    jumpSound.play();

    if (gameDisplay.classList != "start") {
      gameDisplay.classList.add("start");
      setTimeout(scoreCounter, 500);
    }
  }
  gameDisplay.addEventListener("click", jumpMoveMobile);
} else {
  function jumpMove(e) {
    if (e.key === "ArrowUp" || e.key === " ") {
      jump();
      jumpSound.play();

      if (gameDisplay.classList != "start") {
        gameDisplay.classList.add("start");
        setTimeout(scoreCounter, 500);
      }
    }
  }

  window.addEventListener("keydown", jumpMove);

  function duckMove(e) {
    if (e.key === "ArrowDown") {
      dinoImg.src = "./img/dino_duck.png";
    }
  }

  function normalizeDuck(e) {
    if (e.key === "ArrowDown") {
      dinoImg.src = "./img/dino_run.gif";
    }
  }
}

reloadBtn.addEventListener("click", () => window.location.reload());
