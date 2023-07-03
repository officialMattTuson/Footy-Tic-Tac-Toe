import {Component, Input} from '@angular/core';
import {Country, Team} from '../models';
import {MatDialog} from '@angular/material/dialog';
import { SelectorComponent } from '../selector/selector.component';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() value!: 'X' | 'O';
  @Input() isPlayingSquare?: boolean = true;
  @Input() teams?: Team[];
  @Input() countries?: Country[];
  @Input() index?: number;

  selectedOption?: Team;

  dropdownOpen = false;

  constructor(public dialog: MatDialog) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  
  selectCondition() {
    if (this.index === 0) {
      return;
    }
    if (!this.isPlayingSquare) {
      const dialogRef = this.dialog.open(SelectorComponent, {
        width: '20rem',
        data: {
          teams: this.teams,
          countries: this.countries
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        console.log(result)
      })
    }
  }
}
