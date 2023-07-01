import {Component, Input} from '@angular/core';
import {Team} from '../models';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() value!: 'X' | 'O';
  @Input() isPlayingSquare?: boolean = true;
  @Input() teams?: Team[];
  @Input() index?: number;

  selectedOption?: string;

  options = [
    {
      id: 1,
      name: 'Manchester City'
    },
    {
      id: 2,
      name: 'Manchester United'
    },
    {
      id: 3,
      name: 'Liverpool'
    },
  ]
  
  selectCondition() {
    console.log('I am not part of Tic Tac Toe', this.index);
    console.log(this.teams)
  }
}
