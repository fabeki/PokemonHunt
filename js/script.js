"use strict";
import {Player} from "./player.js";
import {Enemy} from "./enemy.js";

const notFoundDiv = document.getElementById("notFound");
const mainContainer = document.querySelector(".main-container");
const statusDiv = document.querySelector(".status");
const livesSpan = document.getElementById("lives");
livesSpan.innerHTML = "";
const collectedSpan = document.getElementById("collected");
collectedSpan.innerHTML = "";

class Board {
  #width;
  #heigth;
  #grid = [];

  constructor(width, heigth, walls) {
    this.#width = width;
    this.#heigth = heigth;
    this.#generateGrid();
    this.#makeWalls(walls);
  }

  get width() {
    return this.#width;
  }
  get heigth() {
    return this.#heigth;
  }

  get grid() {
    return this.#grid;
  }

  #generateGrid() {
    for (let y = 0; y < this.#heigth; y++) {
      const row = [];

      for (let x = 0; x < this.#width; x++) {
        row.push(null);
      }
      this.#grid.push(row);
    }
  }

  #makeWalls(amount) {
    let placed = 0;

    while (placed < amount) {
      const x = Math.floor(Math.random() * this.#width);
      const y = Math.floor(Math.random() * this.#heigth);

      if (this.#grid[y][x] === null) {
        this.#grid[y][x] = "wall";
        placed++;
      }
    }
  }

  processData(dataJSON) {
    dataJSON.forEach((data) => {
      this.#placeJSONData(data);
    });
  }

  #placeJSONData(dataObject) {
    let placed = false;

    while (!placed) {
      const x = Math.floor(Math.random() * this.#width);
      const y = Math.floor(Math.random() * this.#heigth);

      if (this.#grid[y][x] === null) {
        this.#grid[y][x] = {dataObject};
        placed = true;
      }
    }
  }

  render(mainContainer) {
    mainContainer.innerHTML = "";
    for (let y = 0; y < this.#heigth; y++) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      for (let x = 0; x < this.#width; x++) {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");

        const value = this.#grid[y][x];
        if (value === null) {
          cellDiv.style.backgroundColor = "greenyellow";
        } else if (value === "wall") {
          const img = document.createElement("img");
          img.src = "../img/wall.png";
          img.alt = "Wall icon";
          img.title = "Brick icon created by Freepik - Flaticon";
          img.classList.add("wall");

          cellDiv.appendChild(img);
        } else if (typeof value === "object") {
          cellDiv.style.backgroundColor = "greenyellow";
          const img = document.createElement("img");
          img.src = "../img/" + value.dataObject.icon;
          img.alt = value.dataObject.alt;
          img.title = value.dataObject.title;
          img.classList.add(value.dataObject.type);
          cellDiv.appendChild(img);
        }
        rowDiv.appendChild(cellDiv);
      }
      mainContainer.appendChild(rowDiv);
    }
  }
}

async function readData() {
  const response = await fetch("game-data.json");
  if (response.ok) {
    notFoundDiv.hidden = true;
    const data = await response.json();
    board.processData(data);
    board.render(mainContainer);

    const playerData = data.find((object) => object.type === "player");
    for (let i = 0; i < playerData.lives; i++) {
      const img = document.createElement("img");
      img.src = "../img/game.png";
      img.alt = "Health icon";
      img.title = "Game icon created by Roundicons Premium - Flaticon";
      livesSpan.appendChild(img);
    }

    const treasuresLength = data.filter((object) => object.type === "treasure");
    treasuresLength.forEach(() => {
      const img = document.createElement("img");
      img.src = "../img/pokeball-empty.png";
      img.alt = "Empty pokeball icon";
      img.title = "Empty pokeball created by Darius Dan - Flaticon";
      collectedSpan.appendChild(img);
    });
  } else {
    notFoundDiv.hidden = false;
  }
}

const board = new Board(10, 10, 15);

async function startGame() {
  document.getElementById("notFound").hidden = true;
  document.querySelector(".main-container").hidden = false;
  document.querySelector(".status").hidden = false;
  document.getElementById("gameEnd").hidden = true;

  await readData();
  const player = new Player(board);
  const enemy = new Enemy(board);

  player.win = () => {
    enemy.stopMoving();
    document.getElementById("gameEnd").hidden = false;
    document.getElementById("endMessage").innerText = "Proficiat! Je hebt gewonnen!";
    document.querySelector(".main-container").hidden = true;
    document.querySelector(".status").hidden = true;
  };
}
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("intro").hidden = true;
  startGame();
});
document.getElementById("restartBtn").addEventListener("click", () => {
  location.reload();
});

const musicBox = document.getElementById("music");
const musicIfrm = new Audio("/audio/pokemon.mp3");
musicBox.addEventListener("change", function () {
  if (this.checked) {
    musicIfrm.play();
  } else {
    musicIfrm.pause();
  }
});
