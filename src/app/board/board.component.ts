import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Country, Team} from '../models';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() teams: Team[] = [];
  @Input() countries: Country[] = [];
  squares: any[] = [];
  squaresWithConditions: any[] = [];
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
      this.squaresWithConditions.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
      console.log(this.squaresWithConditions)
    }
    switch (idx) {
      case 5:
        console.log(this.squaresWithConditions[1]?.name)
        console.log(this.squaresWithConditions[4]?.name)
        break;
      case 6:
        console.log(this.squaresWithConditions[2]?.name)
        console.log(this.squaresWithConditions[4]?.name)
        break;
      case 7:
        console.log(this.squaresWithConditions[3]?.name)
        console.log(this.squaresWithConditions[4]?.name)
        break;
      case 9:
        console.log(this.squaresWithConditions[1]?.name)
        console.log(this.squaresWithConditions[8]?.name)
        break;
      case 10:
        console.log(this.squaresWithConditions[2]?.name)
        console.log(this.squaresWithConditions[8]?.name)
        break;
      case 11:
        console.log(this.squaresWithConditions[3]?.name)
        console.log(this.squaresWithConditions[8]?.name)
        break;
      case 13:
        console.log(this.squaresWithConditions[1]?.name)
        console.log(this.squaresWithConditions[12]?.name)
        break;
      case 14:
        console.log(this.squaresWithConditions[2]?.name)
        console.log(this.squaresWithConditions[12]?.name)
        break;
      case 15:
        console.log(this.squaresWithConditions[3]?.name)
        console.log(this.squaresWithConditions[12]?.name)
        break;
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

  handleSelectedCondition(event: any, index: number) {
    const selectedOption = {
      name: event?.team ? event.team.name : event.name,
      image: event?.team ? event.team.logo : event.flag
    };
    this.squaresWithConditions[index] = selectedOption;
  }
  
  newGame() {
    this.squares = Array(16).fill(null);
    this.squaresWithConditions = Array(16).fill(null);
    this.xIsNext = false;
  }

  get player() {
    return this.xIsNext ? 'O' : 'X';
  }

}
