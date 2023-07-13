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
  @Input() countrySelectionInvalid?: boolean = true;
  @Input() teams?: Team[];
  @Input() countries?: Country[];
  @Input() conditions!: any[];
  @Input() index?: number;
  @Input() setupComplete?: boolean = false;
  @Output() userSelectedCondition = new EventEmitter<any>();
  @Output() showIncorrectGuessMsg = new EventEmitter<boolean>();
  @Output() showGameStarterMsg = new EventEmitter<boolean>();

  searchQuery: string ='';
  isSearchBoxVisible: boolean = false;
  selectedCountry: Country | null = null;
  selectedTeam: Team | null = null;
  transferInformation: Transfer[] = [];
  transferClubs: string[] = [];
  playerNationality: string = '';
  searchedPlayer!: PlayerBio | null;

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
      return;
    }
    if (!isClickedInsideButton) {
      this.showIncorrectGuessMsg.emit(false);
      this.isSearchBoxVisible = false;
    }
  }

  setSearchConditions() {
    const searchQueryId = this.conditions.find(condition => condition[0]?.team)?.[0]?.team?.id;
    this.searchPlayer(this.searchQuery, searchQueryId);
  }

  searchPlayer(searchQuery: string, id: number) {
    this.footballService.searchPlayer(searchQuery, id).pipe(take(1)).subscribe({
      next: (data) => {
        this.getListOfTransfers(data.response);
        if (!data.response[0]?.player) {
          this.showIncorrectGuessMsg.emit(true);
          this.isSearchBoxVisible = false;
          return;
        }
        this.searchedPlayer = data.response[0]?.player;
        this.playerNationality = (this.searchedPlayer as PlayerBio).nationality;
        this.isSearchBoxVisible = false;
      },
      error: (error) => console.error(error)
    })
  }

  getListOfTransfers(player: PlayerInformation[]) {
    if (!player[0]?.player) {
      this.showIncorrectGuessMsg.emit(true);
      return;
    }
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
    this.matchPlayerToConditions(this.playerNationality, this.transferClubs, this.conditions);
  }

  matchPlayerToConditions(playerNationality: string, transferClubs: string[], conditions: any[]) {

    let matchingNation = false;
    let matchingClub = false;
    let clubConditions: any[] = [];
    let countryCondition: any[] = [];

    conditions.forEach(condition => {
      'team' in condition[0] ? clubConditions.push(condition[0].team) : countryCondition = condition});
    const correctClubConditions = clubConditions.filter(club => transferClubs.some(transferClub => transferClub.includes(club?.name)));
    if ((countryCondition && countryCondition[0]?.name === playerNationality) || countryCondition.length === 0) {
      matchingNation = true;
    }
    if (clubConditions.length === correctClubConditions.length) {
      matchingClub = true;
    }
    if (matchingClub && matchingNation) {
      console.log('Well Done'); 
    } else {
      setTimeout(() => {
        this.showIncorrectGuessMsg.emit(true);
        this.searchedPlayer = null;
        this.searchQuery = '';
      }, 4000);
      
    }
  }

  selectCondition() {
    this.emitConditionMessage(false);
    if (this.index === 0) {
      return;
    }
    if (!this.isPlayingSquare) {
      const dialogRef = this.dialog.open(SelectorComponent, {
        width: '50rem',
        panelClass: 'dialog-container',
        data: {
          teams: this.teams,
          countries: this.countries,
          viewCountries: this.countrySelectionInvalid
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

  emitConditionMessage(boolean: boolean) {
    this.showGameStarterMsg.emit(boolean);
  }

  toggleSearchBox(): void {
    this.isSearchBoxVisible = !this.isSearchBoxVisible;
  }
}
