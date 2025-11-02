"use strict";

export class Player {
  constructor(board) {
    // krijgtwaar het bord van game.js
    this.board = board;
    /* Waar staat de player? */
    this.position = this.findPlayerPosition();
    console.log(this.position);
  }

  /* Functie zoek plaats van player */
  findPlayerPosition() {
    for (let y = 0; y < this.board.heigth; y++) {
      console.log(this.board.heigth);
      for (let x = 0; x < this.board.width; x++) {
        console.log(this.board.width);
        const cellValue = this.board.grid[y][x];
        if (cellValue && cellValue.type === "player") {
          // sommige cellen hebben "null" voorkom error
          return {x, y};
        }
      }
    }
    return {x: 0, y: 0}; //fallback als er geen player is
  }
}
