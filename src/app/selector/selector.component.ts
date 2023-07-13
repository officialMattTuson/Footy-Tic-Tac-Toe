import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Country, Team, TeamInformation } from '../models';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {

  selectedTeam?: Team | null;
  selectedCountry?: Country | null;
  teamSelected?: boolean = true;
  showButtons: boolean = false;
  clubButtonClicked = false;
  divisionSelectorOpen = false;
  divisionTeams: Team[] = [];

  topDivisionCountries: string[] = [];

  @ViewChild('dropdown') dropdown!: MatSelect;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectorComponent>,
    ) {
  }
  
  ngOnInit(): void {
    this.filterTeams(this.data.teams); 
    if (!this.data.viewCountries) {
      this.toggleDivisionSelector();
    }
  }

  filterTeams(teams: Team[]) {
    const countrySet: Set<string> = new Set();
    teams.forEach(team => countrySet.add(team.team.country));
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
  }
  
  onCountrySelected() {
    this.selectedTeam = null;
    this.teamSelected = false;
    this.dropdown.open();
    this.showButtons = false;
  }
  
  onSelected(selectedCountry: string) {
    this.divisionTeams = this.data.teams.filter((team: Team) => team.team.country === selectedCountry);
    this.divisionTeams.sort((a, b) => {
      return a.team.name.toLowerCase().localeCompare(b.team.name.toLowerCase());
    });
    this.dropdown.open();
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSuccess(): void {
    const result = this.selectedCountry ? this.selectedCountry : this.selectedTeam
    this.dialogRef.close(result);
  }
}
