import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, HostListener} from '@angular/core';
import {Condition, Country, PlayerBio, PlayerInformation, Team, Transfer} from '../models';
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
  @Input() conditions!: any[];
  @Input() index?: number;
  @Output() userSelectedCondition = new EventEmitter<any>();

  searchQuery: string ='';
  isSearchBoxVisible: boolean = false;
  selectedCountry: Country | null = null;
  selectedTeam: Team | null = null;
  transferInformation: Transfer[] = [];
  transferClubs: string[] = [];
  playerNationality: string = '';
  searchedPlayer!: PlayerBio;

  constructor(
    private footballService: FootballService,
    public dialog: MatDialog
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isClickedInsideButton = target.classList.contains(`search-button-${this.index}`);
    const isSearchFilterClicked = target.classList.contains(`search-input-${this.index}`);
    
    if (isSearchFilterClicked) {
      this.isSearchBoxVisible = true;
      console.log(this.conditions)
      return;
    }
    if (!isClickedInsideButton) {
      this.isSearchBoxVisible = false;
    }
  }

  searchPlayer() {
    this.footballService.searchPlayer(this.searchQuery, 50).pipe(take(1)).subscribe({
      next: (data) => {
        this.getListOfTransfers(data.response);
        this.searchedPlayer = data.response[0].player;
        this.playerNationality = this.searchedPlayer.nationality;
        this.isSearchBoxVisible = false;
      },
      error: (error) => console.error(error)
    })
  }

  getListOfTransfers(player: PlayerInformation[]) {
    const searchedPlayer = player[0].player;
    this.footballService.getPlayersListOfTeams(searchedPlayer.id).pipe(take(1)).subscribe({
      next: (result) => {
        this.transferInformation = result.response[0].transfers;
        this.collectTeams(this.transferInformation)
      },
      error: (error) => console.error(error)
    })
  }

  collectTeams(transfers: Transfer[]) {
    const TeamsSet: Set<string> = new Set();
    transfers.forEach(transfer => {
      TeamsSet.add(transfer.teams.in.name);
      TeamsSet.add(transfer.teams.out.name);
    });
    this.transferClubs = Array.from(TeamsSet);
    this.matchPlayerToConditions(this.playerNationality, this.transferClubs, this.conditions)
  }

  matchPlayerToConditions(playerNationality: string, transferClubs: string[], conditions: any[]) {

    let matchingNation = false;
    let matchingClub = false;
    let clubConditions: any[] = [];
    let countryCondition: any[] = [];

    conditions.forEach(condition => {
      console.log(condition)
      'team' in condition[0] ? clubConditions.push(condition[0].team) : countryCondition = condition});
    const correctClubConditions = clubConditions.filter(club => transferClubs.some(transferClub => transferClub === club?.name));
    if ((countryCondition && countryCondition[0]?.name === playerNationality) || countryCondition.length === 0) {
      matchingNation = true;
    }
    if (clubConditions.length === correctClubConditions.length) {
      matchingClub = true;
    }
    (matchingClub && matchingNation) ? console.log('Well Done') : console.log('Nope');
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
        this.userSelectedCondition.emit(result);
      })
    }
  }

  toggleSearchBox(): void {
    this.isSearchBoxVisible = !this.isSearchBoxVisible;
  }
}
