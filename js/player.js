"use strict";

export class Player {
  constructor(board) {
    // krijgtwaar het bord van game.js
    this.board = board;

    /* Waar staat de player? */
    this.position = this.findPlayerPosition();

    /* https://javascript.info/keyboard-events */
    document.addEventListener("keydown", (event) => {
      this.handleKey(event);
    });
  }

  /* Functie zoek plaats van player */
  findPlayerPosition() {
    for (let y = 0; y < this.board.heigth; y++) {
      for (let x = 0; x < this.board.width; x++) {
        const cellValue = this.board.grid[y][x];
        if (typeof cellValue === "object" && cellValue && cellValue.dataObject.type === "player") {
          // sommige cellen hebben "null" voorkom error
          return {x, y};
        }
      }
    }
    return {x: 0, y: 0}; //fallback als er geen player is
  }

  handleKey(event) {
    event.preventDefault();
    let x = this.position.x;
    let y = this.position.y;
    console.log(x, y);

    switch (
      event.key // zie property via f12
    ) {
      case "ArrowUp":
      case "8":
        y--;
        break;
      case "ArrowDown":
      case "2":
        y++;
        break;
      case "ArrowLeft":
      case "4":
        x--;
        break;
      case "ArrowRight":
      case "6":
        x++;
        break;
      default:
        return;
    }

    const playerData = this.board.grid[this.position.y][this.position.x];
    const currentCell = this.board.grid[y][x];
    console.log(playerData);
    console.log(currentCell);

    // Kan niet buiten bord
    if (x < 0 || x >= this.board.width || y < 0 || y >= this.board.heigth) {
      return;
    }
    // muur obstakel
    if (currentCell === "wall") {
      return;
    }

    //enemy
    if (currentCell && typeof currentCell === "object" && currentCell.dataObject.type === "enemy") {
      if (playerData.dataObject.lives && playerData.dataObject.lives > 0) {
        playerData.dataObject.lives--;
        console.log(playerData.dataObject.lives);
        const livesSpan = document.getElementById("lives");
        livesSpan.removeChild(livesSpan.lastChild);
        return;
      }
      return;
    }

    //player moving
    this.board.grid[this.position.y][this.position.x] = null;
    this.board.grid[y][x] = playerData;

    this.position.x = x;
    this.position.y = y;

    this.board.render(document.querySelector(".main-container")); //data blijft in grid bord wordt niet gereset
  }
}
