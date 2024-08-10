let startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', () => {
  startGame();
});

let playerForm = document.getElementById('player-form');
playerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  setPlayer(e);
});

let switchPlayer = document.getElementById('change-player');
switchPlayer.addEventListener('click', () => {
  changePlayer();
});

let pump = document.getElementById('pump');
pump.addEventListener('click', () => {
  inflate();
});

// Game Logic & Data
// DATA
let clickCounter = 0;
let height = 120;
let width = 100;
let inflationRate = 20;
let maxSize = 300;
let maxPopCount = 0;
let popCounter = 0;
let gameLength = 10000;
let clockId = 0;
let timeRemaining = 0;
let currentPlayer = {};
let currentColor = 'red';
let possibleColors = ['red', 'green', 'blue', 'purple', 'pink'];

function startGame() {
  document.getElementById('game-controls').classList.remove('hidden');
  document.getElementById('main-controls').classList.add('hidden');
  document.getElementById('scoreboard').classList.add('hidden');
  startClock();
  setTimeout(stopGame, gameLength);
}

function startClock() {
  timeRemaining = gameLength;
  drawClock();
  clockId = setInterval(drawClock, 1000);
}

function stopClock() {
  let countdown = document.getElementById('countdown');
  countdown.innerText = timeRemaining / 1000;
  clearInterval(clockId);
}

function drawClock() {
  let countdown = document.getElementById('countdown');
  countdown.innerText = timeRemaining / 1000;
  timeRemaining -= 1000;
}

function inflate() {
  ++clickCounter;
  height += inflationRate;
  width += inflationRate;
  checkBalloonPop();
  draw();
}

function checkBalloonPop() {
  if (height >= maxSize) {
    let balloon = document.getElementById('balloon');
    balloon.classList.remove(currentColor);
    getRandomColor();
    balloon.classList.add(currentColor);

    document.getElementById('pop-sound').play();

    ++popCounter;
    height = 30;
    width = 0;
  }
}

function getRandomColor() {
  let i = Math.floor(Math.random() * possibleColors.length);
  currentColor = possibleColors[i];
}

function draw() {
  let balloon = document.getElementById('balloon');
  let clickCount = document.getElementById('click-count');
  let popCount = document.getElementById('pop-count');
  let maxPopCountElem = document.getElementById('high-pop-count');
  let playerNameElem = document.getElementById('player-name');

  balloon.style.height = height + 'px';
  balloon.style.width = width + 'px';

  clickCount.innerText = clickCounter;
  popCount.innerText = popCounter;
  maxPopCountElem.innerText = currentPlayer.topScore;
  playerNameElem.innerText = currentPlayer.name;
}

function stopGame() {
  document.getElementById('main-controls').classList.remove('hidden');
  document.getElementById('game-controls').classList.add('hidden');
  document.getElementById('scoreboard').classList.remove('hidden');

  clickCounter = 0;
  height = 120;
  width = 100;

  if (popCounter > currentPlayer.topScore) {
    currentPlayer.topScore = popCounter;
    savePlayers();
  }

  popCounter = 0;

  stopClock();
  draw();
  drawScoreboard();
}

// Players
let players = [];
loadPlayers();

function setPlayer(e) {
  let form = e.target;
  let playerName = form.playerName.value;
  currentPlayer = players.find((player) => player.name == playerName);

  if (!currentPlayer) {
    currentPlayer = {name: playerName, topScore: 0};
    players.push(currentPlayer);
    savePlayers();
  }

  form.reset();
  document.getElementById('game').classList.remove('hidden');
  form.classList.add('hidden');
  draw();
  drawScoreboard();
}

function changePlayer() {
  document.getElementById('player-form').classList.remove('hidden');
  document.getElementById('game').classList.add('hidden');
}

function savePlayers() {
  window.localStorage.setItem('players', JSON.stringify(players));
}

function loadPlayers() {
  let playersData = JSON.parse(window.localStorage.getItem('players'));
  if (playersData) {
    players = playersData;
  }
}

function drawScoreboard() {
  let template = '';

  players.sort((p1, p2) => p2.topScore - p1.topScore);

  players.forEach((player) => {
    template += `
    <div class="d-flex space-between">
      <span>
        <i class="fa-solid fa-circle-user"></i>
        ${player.name}
      </span>
      <span>Score: ${player.topScore}</span>
    </div>`;
  });

  document.getElementById('players').innerHTML = template;
}

drawScoreboard();
