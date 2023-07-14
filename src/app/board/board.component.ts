import {Component, Input, OnInit} from '@angular/core';
import {Country, Team} from '../models';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() teams: Team[] = [];
  @Input() countries: Country[] = [];
  conditionsToMatch! : any[];
  squares: any[] = [];
  squaresWithConditions: any[] = [];
  winner: string = '';
  indexedDisabledSquares: number[] = [0,1,2,3,4,8,12];
  playerOneSquares = [1,2,3];
  playerTwoSquares = [4,8,12];
  playerOneCanSelectCountries = true;
  playerTwoCanSelectCountries = true;
  playerTwoIsNext!: boolean;
  startSquaresUnused: number[] = [];
  showIncorrectMsg: boolean = false;
  showGameStarterMsg: boolean = false;
  isGameSetupComplete: boolean = false;


  constructor() {}

  ngOnInit(): void {
    this.startSquaresUnused = this.indexedDisabledSquares.slice();
    this.newGame();
  }

  makeMove(idx: number) {
    if (this.showGameStarterMsg) {
      return;
    }
    if (!this.squaresWithConditions[idx]) {
      this.squaresWithConditions.splice(idx, 1, this.player);
    }
    switch (idx) {
      case 5:
        this.conditionsToMatch = [
          [this.squaresWithConditions[1]],
          [this.squaresWithConditions[4]]
        ]
        break;
      case 6:
        this.conditionsToMatch = [
          [this.squaresWithConditions[2]],
          [this.squaresWithConditions[4]]
        ]
        break;
      case 7:
        this.conditionsToMatch = [
          [this.squaresWithConditions[3]],
          [this.squaresWithConditions[4]]
        ]
        break;
      case 9:
        this.conditionsToMatch = [
          [this.squaresWithConditions[1]],
          [this.squaresWithConditions[8]]
        ]
        break;
      case 10:
        this.conditionsToMatch = [
          [this.squaresWithConditions[2]],
          [this.squaresWithConditions[8]]
        ]
        break;
      case 11:
        this.conditionsToMatch = [
          [this.squaresWithConditions[3]],
          [this.squaresWithConditions[8]]
        ]
        break;
      case 13:
        this.conditionsToMatch = [
          [this.squaresWithConditions[1]],
          [this.squaresWithConditions[12]]
        ]
        break;
      case 14:
        this.conditionsToMatch = [
          [this.squaresWithConditions[2]],
          [this.squaresWithConditions[12]]
        ]
        break;
      case 15:
        this.conditionsToMatch = [
          [this.squaresWithConditions[3]],
          [this.squaresWithConditions[12]]
        ]
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
    const selectedOption = event
    this.squaresWithConditions[index] = selectedOption;
    selectedOption.name && this.restrictCountriesToOnePlayer(index);
    this.checkStartConditions();    
  }

  restrictCountriesToOnePlayer(index: number) {
    if (this.playerOneSquares.indexOf(index) > -1) {
      this.playerTwoCanSelectCountries = false;
    } else {
      this.playerOneCanSelectCountries = false;
      
    }

  }

  checkStartConditions() {
    let conditionSquares = this.squaresWithConditions;
    this.startSquaresUnused.forEach((square, index) => {
      if (conditionSquares[square]) {
        this.startSquaresUnused.splice(index, 1);
      }
    })
    if (this.startSquaresUnused.length === 1) {
      this.isGameSetupComplete = true;
      this.showGameStarterMsg = false;
    }
  }
  
  newGame() {
    this.squares = Array(16).fill('');
    this.squaresWithConditions = Array(16).fill('');
    this.playerTwoIsNext = true;
  }

  togglePlayer() {
    this.playerTwoIsNext = !this.playerTwoIsNext;
  }

  toggleIncorrectMsg(showMsg: boolean) {
    this.showIncorrectMsg = showMsg;
  }

  toggleGameStarterMsg(showMsg: boolean) {
    this.showGameStarterMsg = showMsg;
  }  

  get player() {
    return this.playerTwoIsNext ? 'X' : 'O';
  }

}
