import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit} from '@angular/core';
import {Country, PlayerInformation, Team} from '../models';
import {MatDialog} from '@angular/material/dialog';
import { SelectorComponent } from '../selector/selector.component';
import { FootballService } from '../football.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() value!: any;
  @Input() isPlayingSquare?: boolean = true;
  @Input() teams?: Team[];
  @Input() countries?: Country[];
  @Input() index?: number;
  @Output() userSelectedCondition = new EventEmitter<any>();

  selectedCountry: Country | null = null;
  selectedTeam: Team | null = null;

  constructor(
    private footballService: FootballService,
    public dialog: MatDialog
  ) {}

  searchPlayer() {
    this.footballService.searchPlayer('Haaland').pipe(take(1)).subscribe({
      next: (data) => this.getTeamsByPlayer(data.response),
      error: (error) => console.error(error)
    })
  }

  getTeamsByPlayer(player: PlayerInformation[]) {
    const searchedPlayer = player[0].player;
    this.footballService.getPlayersListOfTeams(searchedPlayer.id).pipe(take(1)).subscribe({
      next: (result) => console.log(result),
      error: (error) => console.error(error)
    })
  }

  selectCondition() {
    if (this.index === 0) {
      return;
    }
    if (!this.isPlayingSquare) {
      const dialogRef = this.dialog.open(SelectorComponent, {
        width: '50rem',
        panelClass: 'dialog-container',
        data: {
          teams: this.teams,
          countries: this.countries
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        if (result?.flag) {
          this.selectedCountry = result; 
          this.selectedTeam = null;
        } else {
          this.selectedTeam = result;
          this.selectedCountry = null;
        }
        // this.userSelectedCondition.emit(result);
      })
    }
  }
}
