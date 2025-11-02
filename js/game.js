"use strict";

const notFoundDiv = document.getElementById("notFound");
const mainContainer = document.querySelector(".main-container");

/* MAAK GAMEBOARD */
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
  /* enkel als je het buiten de klasse nodig hebt 
  get grid() {
    return this.#grid;
  }*/

  #generateGrid() {
    for (let y = 0; y < this.#heigth; y++) {
      const row = []; // lege rij

      for (let x = 0; x < this.#width; x++) {
        row.push(null); // lege kolom in rij (later stylen met groen)
      }
      this.#grid.push(row); // voeg de hele rij toe in de grid
    }
  }

  /* ZET MUREN IN HET BORD */
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

  /* PLAATS DE JSON OBJECTEN IN HET BORD */
  processData(dataJSON) {
    dataJSON.forEach((data) => {
      if (data.type === "player") {
        this.#placeJSONData("player", data.icon, data.title, data.alt);
      } else if (data.type === "enemy") {
        this.#placeJSONData("enemy", data.icon, data.title, data.alt);
      } else if (data.type === "treasure") {
        this.#placeJSONData("treasure", data.icon, data.title, data.alt);
      }
    });
  }

  #placeJSONData(type, icon, title, alt) {
    let placed = false;

    while (!placed) {
      const x = Math.floor(Math.random() * this.#width);
      const y = Math.floor(Math.random() * this.#heigth);

      if (this.#grid[y][x] === null) {
        this.#grid[y][x] = {type, icon, title, alt};
        placed = true;
      }
    }
  }

  /* TOON HET BORD EN VUL DE HTML CELLEN */
  render(mainContainer) {
    mainContainer.innerHTML = ""; //Maak opnieuw voor elke spel

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
          img.src = "/img/wall.png";
          img.alt = "Wall icon";
          img.title = "Brick icon created by Freepik - Flaticon";
          img.classList.add("wall");

          cellDiv.appendChild(img);
        } else if (typeof value === "object") {
          cellDiv.style.backgroundColor = "greenyellow";
          const img = document.createElement("img");
          img.src = "/img/" + value.icon;
          img.alt = value.alt;
          img.title = value.title;
          img.classList.add(value.type);

          cellDiv.appendChild(img);
        }
        rowDiv.appendChild(cellDiv);
      }
      mainContainer.appendChild(rowDiv);
    }
  }
}

/* HAAL JSON DATA OP + VERWERK */

async function readData() {
  const response = await fetch("game-data.json");
  if (response.ok) {
    notFoundDiv.hidden = true;
    const data = await response.json();
    board.processData(data);
    board.render(mainContainer);
  } else {
    notFoundDiv.hidden = false;
  }
}

/* PAS GEGEVENS AAN + SPEL STARTEN */
const board = new Board(10, 10, 15);
readData();
