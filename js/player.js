"use strict";

export class Player {
  constructor(board) {
    this.board = board;

    this.position = this.findPlayerPosition();

    document.addEventListener("keydown", (event) => {
      this.handleKey(event);
    });
  }

  findPlayerPosition() {
    for (let y = 0; y < this.board.heigth; y++) {
      for (let x = 0; x < this.board.width; x++) {
        const cellValue = this.board.grid[y][x];
        if (typeof cellValue === "object" && cellValue && cellValue.dataObject.type === "player") {
          return {x, y};
        }
      }
    }
    return {x: 0, y: 0};
  }

  handleKey(event) {
    event.preventDefault();
    let x = this.position.x;
    let y = this.position.y;

    switch (event.key) {
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

    if (x < 0 || x >= this.board.width || y < 0 || y >= this.board.heigth) {
      return;
    }

    const playerData = this.board.grid[this.position.y][this.position.x];
    const currentCell = this.board.grid[y][x];

    if (currentCell === "wall") {
      return;
    }

    if (currentCell && typeof currentCell === "object" && currentCell.dataObject.type === "enemy") {
      return;
    }

    const collectedSpan = document.getElementById("collected");
    const emptyTreasure = collectedSpan.querySelector('img[src="/img/pokeball-empty.png"]');
    if (currentCell && typeof currentCell === "object" && currentCell.dataObject.type === "treasure") {
      if (emptyTreasure) {
        emptyTreasure.src = "/img/pokeball.png";
        emptyTreasure.alt = "Pokeball icon";
        emptyTreasure.title = "Pokeball icon created by Those Icons - Flaticon";
      }

      const remainingTreasures = collectedSpan.querySelectorAll('img[src="/img/pokeball-empty.png"]').length;
      if (remainingTreasures === 0 && this.win) {
        this.win();
        return;
      }
    }

    this.board.grid[this.position.y][this.position.x] = null;
    this.board.grid[y][x] = playerData;

    this.position.x = x;
    this.position.y = y;

    this.board.render(document.querySelector(".main-container"));
  }
}
