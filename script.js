const rubyPoints = document.getElementById('ruby-points');
const sapphirePoints = document.getElementById('sapphire-points');
const amberPoints = document.getElementById('amber-points');
const pearlPoints = document.getElementById('pearl-points');
const winner = document.getElementById('winner');
const startButton = document.getElementById('start-button');
const startButtonContainer = document.getElementById('start-button-container');
const elem = document.getElementById('body');
const img = document.getElementById('img');
const container = document.getElementById('container');
const sabre = document.getElementById('sabre');

let startGameAfterFetch = false;

const createGameEnv = () => {
  let currentOpacity = 0;

  const showHousesInterval = setInterval(() => {
    if (container.style.opacity < 1) {
      currentOpacity += 0.02;
      container.style.opacity = currentOpacity;
      if (sabre.style.opacity < 0.1) {
        sabre.style.opacity = currentOpacity;
      }
    } else {
      start = true;
      clearInterval(showHousesInterval);
    }
  }, 30);
};

startButton.addEventListener('click', () => {
  startButton.style.pointerEvents = 'none';

  let startOpacity = 1;

  const buttonInterval = setInterval(() => {
    if (startOpacity < 0) {
      if (window.innerWidth > 1000) {
        startButton.requestFullscreen();
      }

      createGameEnv();
      startButton.style.display = 'none';
      img.style.display = 'none';
      startButtonContainer.style.background = '#ffffff';

      clearInterval(buttonInterval);
    }
    startButtonContainer.style.opacity = startOpacity;
    startButton.style.opacity = startOpacity;
    startOpacity -= 0.01;
    img.style.opacity -= 0.01;
  }, 10);
});

let start = false;

const showWinner = () => {
  if (winningIndex == 0) {
    winner.innerHTML = ' ' + houses[0].winningMessage;
    winner.style.backgroundColor = '#c11c22';
  }
  if (winningIndex == 1) {
    winner.innerHTML = ' ' + houses[1].winningMessage;
    winner.style.backgroundColor = '#1271b5';
  }
  if (winningIndex == 2) {
    winner.innerHTML = ' ' + houses[2].winningMessage;
    winner.style.backgroundColor = '#e46725';
  }
  if (winningIndex == 3) {
    winner.innerHTML = ' ' + houses[3].winningMessage;
    winner.style.backgroundColor = '#000000';
  }

  let winnerOpacity = 0;
  const showWinnerInterval = setInterval(() => {
    winnerOpacity += 0.01;
    if (winner.style.opacity < 1) {
      winner.style.opacity = winnerOpacity;
    } else {
      clearInterval(showWinnerInterval);
    }
  }, 50);
};

const houses = [
  {
    houseReference: rubyPoints,
    totalPoints: 0,
    difference: 0,
    currentNumber: 0,
    winner: false,
    winningMessage: '',
  },
  {
    houseReference: sapphirePoints,
    totalPoints: 0,
    difference: 0,
    currentNumber: 0,
    winner: false,
    winningMessage: '',
  },
  {
    houseReference: amberPoints,
    totalPoints: 0,
    difference: 0,
    currentNumber: 0,
    winner: false,
    winningMessage: '',
  },
  {
    houseReference: pearlPoints,
    totalPoints: 0,
    difference: 0,
    currentNumber: 0,
    winner: false,
    winningMessage: '',
  },
];

let winningIndex = 0;
let largestScore = 0;

fetch('https://sports-day.herokuapp.com/get')
  .then((response) => response.json())
  .then((data) => {
    houses[0].totalPoints = +data[0].points;
    houses[1].totalPoints = +data[1].points;
    houses[2].totalPoints = +data[3].points;
    houses[3].totalPoints = +data[2].points;

    houses[0].winningMessage = data[0].message;
    houses[1].winningMessage = data[1].message;
    houses[2].winningMessage = data[3].message;
    houses[3].winningMessage = data[2].message;

    console.log(data[0].points);
    console.log(data[0].message);

    const findWinner = () => {
      let entry = houses[0].totalPoints;
      for (let i = 1; i < houses.length; i++) {
        if (entry < houses[i].totalPoints) {
          winningIndex = i;
          largestScore = i;
          entry = houses[i].totalPoints;
        }
      }
    };

    //startButtonContainer.style.display = 'block';
    findWinner();
    startGameAfterFetch = true;
  });

let finished;

const gameInterval = setInterval(() => {
  if (startGameAfterFetch) {
    finished = 0;
    houses.forEach((house) => {
      if (start) {
        house.difference = house.totalPoints - house.currentNumber;
        if (house.difference > 100) {
          house.currentNumber += Math.floor(Math.random() * 8);
          //Make the counter more interesting with timeouts
          // let num = Math.floor(Math.random() * 15);
          // if (num == 10) {
          //   setTimeout(() => {
          //     console.log('Timeout');
          //   }, 2000);
          // }
        } else if (house.difference > 50) {
          house.currentNumber += Math.floor(Math.random() * 4);
          // let num = Math.floor(Math.random() * 15);
          // if (num == 10) {
          //   setTimeout(() => {
          //     console.log('Timeout');
          //   }, 2000);
          // }
        } else if (house.difference > 25) {
          house.currentNumber += Math.floor(Math.random() * 3);
          // let num = Math.floor(Math.random() * 15);
          // if (num == 10) {
          //   setTimeout(() => {
          //     console.log('Final Timeout');
          //   }, 5000);
          // }
        } else if (house.difference > 12) {
          house.currentNumber += Math.floor(Math.random() * 2);
          // let num = Math.floor(Math.random() * 10);
          // if (num == 5) {
          //   setTimeout(() => {
          //     console.log('Timeout');
          //   }, 2000);
          // }
        } else if (house.difference > 0) {
          house.currentNumber += 1;
          // let num = Math.floor(Math.random() * 5);
          // if (num == 3) {
          //   setTimeout(() => {
          //     console.log('Timeout');
          //   }, 2000);
          // }
        }
        house.houseReference.innerHTML = house.currentNumber;

        if (house.difference === 0) {
          finished++;
        }
      }
    });

    if (finished === houses.length) {
      clearInterval(gameInterval);
      setTimeout(() => {
        showWinner();
      }, 1000);
    }
  }
}, 80);
