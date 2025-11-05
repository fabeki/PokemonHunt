"use strict";

export class Enemy {
  constructor(board) {
    this.board = board;
    this.position = this.findEnemyPosition();
    this.Interval = null;
    this.startMoving();
  }

  findEnemyPosition() {
    for (let y = 0; y < this.board.heigth; y++) {
      for (let x = 0; x < this.board.width; x++) {
        const cellValue = this.board.grid[y][x];

        if (typeof cellValue === "object" && cellValue && cellValue.dataObject.type === "enemy") {
          return {x, y};
        }
      }
    }
    return {x: 0, y: 0};
  }

  startMoving() {
    this.interval = setInterval(() => {
      //arrow function blijft gebonden aan klasse, anders zou ik this niet kunnen gebruiken
      this.moveRandom();
    }, 250);
  }
  stopMoving() {
    clearInterval(this.interval);
  }

  moveRandom() {
    const directions = [
      {y: 0, x: -1},
      {y: -1, x: 0},
      {y: 0, x: 1},
      {y: 1, x: 0},
    ];

    const directionsRandom = directions[Math.floor(Math.random() * directions.length)]; // random element van object
    //enemy plaats verplaatst
    const x = this.position.x + directionsRandom.x;
    const y = this.position.y + directionsRandom.y;

    // kan niet buiten het bord
    if (x < 0 || x >= this.board.width || y < 0 || y >= this.board.heigth) {
      return;
    }
    const currentCell = this.board.grid[y][x];

    //player verliest leven
    if (currentCell && typeof currentCell === "object" && currentCell.dataObject.type === "player") {
      const livesSpan = document.getElementById("lives");

      if (livesSpan.lastChild) {
        livesSpan.removeChild(livesSpan.lastChild);
      }
      //gameover
      if (!livesSpan.hasChildNodes()) {
        clearInterval(this.interval);
        alert("Game Over. Meowth heeft je te pakken !");
        location.reload();
        return;
      }

      return;
    }

    // muur + treasure
    if (currentCell === null) {
      //enemy moving
      const enemyData = this.board.grid[this.position.y][this.position.x];
      this.board.grid[this.position.y][this.position.x] = null;
      this.board.grid[y][x] = enemyData;
    } else {
      return;
    }

    this.position.x = x;
    this.position.y = y;

    this.board.render(document.querySelector(".main-container")); //data blijft in grid bord wordt niet gereset
  }
}
