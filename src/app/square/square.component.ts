import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
} from '@angular/core';
import {
  Country,
  PlayerBio,
  PlayerInformation,
  Team,
  Transfer,
  characterMap,
} from '../models';
import { MatDialog } from '@angular/material/dialog';
import { SelectorComponent } from '../selector/selector.component';
import { FootballService } from '../football.service';
import { take } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss'],
})
export class SquareComponent {
  @Input() value!: any;
  @Input() isPlayingSquare?: boolean = true;
  @Input() countrySelectionInvalid?: boolean = true;
  @Input() teams?: Team[];
  @Input() countries?: Country[];
  @Input() conditions!: any[];
  @Input() playingSquares!: any[];
  @Input() index!: number;
  @Input() setupComplete?: boolean = false;
  @Input() playerTwoIsNext!: boolean;
  @Output() userSelectedCondition = new EventEmitter<any>();
  @Output() isTurnTaken = new EventEmitter<boolean>();
  @Output() showIncorrectGuessMsg = new EventEmitter<boolean>();
  @Output() showGameStarterMsg = new EventEmitter<boolean>();

  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;
    
  searchQuery: string = '';
  isSearchBoxVisible: boolean = false;
  selectedCountry: Country | null = null;
  selectedTeam: Team | null = null;
  transferInformation: Transfer[] = [];
  transferClubs: string[] = [];
  playerNationality: string = '';
  searchedPlayer!: PlayerBio | null;
  filteredPlayersList: string[] = [];

  constructor(
    private footballService: FootballService,
    public dialog: MatDialog
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isClickedInsideButton = target.classList.contains(
      `search-button-${this.index}`
    );
    const isSearchFilterClicked = target.classList.contains(
      `search-input-${this.index}`
    );

    if (isSearchFilterClicked) {
      this.isSearchBoxVisible = true;
      return;
    }
    if (!isClickedInsideButton) {
      this.showIncorrectGuessMsg.emit(false);
      this.isSearchBoxVisible = false;
    }
  }

  filterPlayers(event: any) {
    const playersArray: string[] = [];
    const searchQuery = event.target.value;
    const searchQueryId = this.conditions.find((condition) => condition[0]?.team)?.[0]?.team?.id;
    this.footballService.getTransferHistory(searchQueryId).pipe(take(1)).subscribe({
      next: (data) => {
        data.response.forEach((transfer: any )=> playersArray.push(transfer.player.name.toLowerCase()));
        this.filteredPlayersList = playersArray.filter((player: string) => player.includes(searchQuery));
      },
      error: (error) => console.error(error),
    })
  }

  setSearchConditions() {
    const searchQueryId = this.conditions.find((condition) => condition[0]?.team)?.[0]?.team?.id;
    this.searchPlayer(this.searchQuery, searchQueryId);
  }

  searchPlayer(searchQuery: string, id: number) {
    this.footballService
      .searchPlayer(searchQuery, id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log(data)
          if (!data.response[0]?.player) {
            this.showIncorrectGuessMsg.emit(true);
            this.isTurnTaken.emit(true);
            this.isSearchBoxVisible = false;
            return;
          }
          this.getListOfTransfers(data.response);
          this.searchedPlayer = data.response[0]?.player;
          this.playerNationality = (
            this.searchedPlayer as PlayerBio
          ).nationality;
          this.isSearchBoxVisible = false;
        },
        error: (error) => {
          this.isTurnTaken.emit(true);
          this.showIncorrectGuessMsg.emit(true);
          console.error(error)
        },
      });
  }

  getListOfTransfers(player: PlayerInformation[]) {
    const searchedPlayer = player[0].player;
    this.footballService
      .getPlayersListOfTeams(searchedPlayer.id)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.transferInformation = result.response[0]?.transfers;
          this.collectTeams(this.transferInformation);
        },
        error: (error) => console.error(error),
      });
  }

  collectTeams(transfers: Transfer[]) {
    const TeamsSet: Set<string> = new Set();
    console.log(transfers)
    if (transfers) {
      transfers.forEach((transfer) => {
        TeamsSet.add(transfer.teams.in.name);
        TeamsSet.add(transfer.teams.out.name);
      });
    }
    this.transferClubs = Array.from(TeamsSet);
    this.matchPlayerToConditions(
      this.playerNationality,
      this.transferClubs,
      this.conditions
    );
  }

  matchPlayerToConditions(
    playerNationality: string,
    transferClubs: string[],
    conditions: any[]
  ) {
    let matchingNation = false;
    let matchingClub = false;
    let clubConditions: any[] = [];
    let countryCondition: any[] = [];

    conditions.forEach((condition) => {
      'team' in condition[0]
        ? clubConditions.push(condition[0].team)
        : (countryCondition = condition);
    });
    const correctClubConditions = clubConditions.filter((club) =>
      transferClubs.some((transferClub) => transferClub.includes(club?.name))
    );
    if (
      (countryCondition && countryCondition[0]?.name === playerNationality) ||
      countryCondition.length === 0
    ) {
      matchingNation = true;
    }
    if ((clubConditions.length === correctClubConditions.length) || transferClubs.length === 0) {
      matchingClub = true;
    }
    if (matchingClub && matchingNation) {
    } else {
      setTimeout(() => {
        this.showIncorrectGuessMsg.emit(true);
        this.searchedPlayer = null;
        this.searchQuery = '';
      }, 3000);
    }
    this.isTurnTaken.emit(true);
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
          viewCountries: this.countrySelectionInvalid,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
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
        this.isTurnTaken.emit(true);
        this.userSelectedCondition.emit(result);
      });
    }
  }

  emitConditionMessage(boolean: boolean) {
    this.showGameStarterMsg.emit(boolean);
  }

  toggleSearchBox(): void {
    this.isSearchBoxVisible = !this.isSearchBoxVisible;
  }

  setBackGroundColor(index: number): any {
    let styleObject = '';
    const squareValue = this.playingSquares[index];
    if (this.isPlayingSquare && !this.setupComplete) {
      return '';
    } 

    if (this.searchedPlayer) {
      if (squareValue === 'X') {
        styleObject ='#ff0000'; 
      } else if (squareValue === 'O') {
        styleObject = '#0000ff';
      } 
    }

    return styleObject;
  }

  capitalizeNames(string: string) {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  replaceCharacters(string: string) {

    const words = string.split(' ');
    const secondWord = words[words.length - 1];
    const replacedWord = secondWord?.replace(/[^a-zA-Z0-9]/g, match => (characterMap as any)[match] || match);    words[1] = replacedWord;
    return replacedWord;
  }
}
