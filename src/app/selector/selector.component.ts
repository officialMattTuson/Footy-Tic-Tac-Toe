import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Country, Team, TeamInformation } from '../models';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent implements OnInit {
  teamsByDivision: TeamInformation[] = [];
  selectedTeam?: TeamInformation | null;
  allTeams: TeamInformation[] = [];
  selectedCountry?: Country | null;

  playerUsingSearchFilter = false;
  divisionSelectorOpen = false;
  countrySelectorOpen = false;
  clubButtonClicked = false;
  teamSelected = true;
  showButtons = false;
  isSearching = false;

  searchQuery = '';

  conditions: Array<Country | TeamInformation> | TeamInformation[] = [];
  filteredConditions: any[] = [];
  marginBlockStart: any;

  topDivisionCountries: string[] = [];

  @ViewChild('dropdown') dropdown!: MatSelect;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectorComponent>
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isSearchBoxClicked = target.classList.contains('search-box');
    this.playerUsingSearchFilter = isSearchBoxClicked;
  }

  ngOnInit(): void {
    this.filterTeams(this.data.teams);
    this.allTeams = this.data.teams.map((team: Team) => team.team);
    this.allTeams.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    this.conditions = this.data.countries.concat(this.allTeams);
    if (!this.data.viewCountries) {
      this.toggleDivisionSelector();
      this.conditions = this.allTeams;
    }
  }

  filterConditionsForSearchFilter(event: any) {
    this.resetSearch();
    const searchQuery: string = event.target.value;
    if (this.divisionSelectorOpen) {
      this.filteredConditions = this.allTeams.filter((team: TeamInformation) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      this.filteredConditions = this.conditions.filter((condition: any) =>
        condition.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }

  getSelectedCondition() {
    const selectedCondition = this.conditions.find(condition => condition.name === this.searchQuery);
    if (this.data.countries.indexOf(selectedCondition) > -1) {
      this.selectedCountry = selectedCondition as Country;
    } else {
      const teamCondition: Team = this.data.teams.find(
        (team: Team) => team.team === (selectedCondition as TeamInformation)
      );
      this.selectedTeam = teamCondition.team;
    }
  }

  filterTeams(teams: Team[]) {
    const countrySet: Set<string> = new Set();
    teams.forEach((team) => countrySet.add(team.team.country));
    this.topDivisionCountries = Array.from(countrySet);
    this.topDivisionCountries.sort((a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  }

  openDropdown() {
    this.dropdown.open();
  }

  toggleDivisionSelector() {
    this.clubButtonClicked = !this.clubButtonClicked;
    this.divisionSelectorOpen = true;
    this.marginBlockStart = '0rem';
    this.countrySelectorOpen = false;
    this.teamsByDivision = this.allTeams;
  }

  onCountrySelected() {
    this.selectedTeam = null;
    this.teamSelected = false;
    this.divisionSelectorOpen = false;
    this.countrySelectorOpen = true;
    this.dropdown.open();
    this.showButtons = false;
  }

  onDivisionSelected() {
    this.selectedCountry = null;
    this.countrySelectorOpen = false;
    this.dropdown.open();
    this.showButtons = false;
  }

  onSelected(selectedCountry: string) {
    this.teamsByDivision = this.allTeams.filter(
      (team: TeamInformation) => team.country === selectedCountry
    );
    this.dropdown.open();
  }

  resetSearch() {
    this.selectedCountry = null;
    this.selectedTeam = null;
    this.isSearching = true;
  }

  resetSelector() {
    this.resetSearch();
    this.clubButtonClicked = false;
    this.divisionSelectorOpen = false;
    this.countrySelectorOpen = false;
    this.marginBlockStart = '8rem';
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSuccess(): void {
    const result = this.selectedCountry
      ? this.selectedCountry
      : this.selectedTeam;
    this.dialogRef.close(result);
  }
}
