import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  squares!: any[];
  xIsNext!: boolean;
  winner: string = '';
  indexedDisabledSquares: number[] = [0,1,2,3,4,8,12];

  constructor() {}

  ngOnInit(): void {
    this.newGame();
  }

  makeMove(idx: number) {
    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();
  }

  calculateWinner() {
    const lines = [
      [5, 6, 7],
      [9, 10, 11],
      [13, 14, 15],
      [5, 9, 13],
      [6, 10, 14],
      [7, 11, 15],
      [5, 10, 15],
      [2, 4, 13]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }

  newGame() {
    this.squares = Array(16).fill(null);
    this.xIsNext = false;
  }

  get player() {
    return this.xIsNext ? 'O' : 'X';
  }

}
