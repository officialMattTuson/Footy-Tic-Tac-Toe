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
  premierLeagueClubs: Team[] = [];
  championshipClubs: Team[] = [];
  germanClubs: Team[] = [];
  spanishClubs: Team[] = [];
  italianClubs: Team[] = [];
  frenchClubs: Team[] = [];
  portugueseClubs: Team[] = [];

  @ViewChild('dropdown') dropdown!: MatSelect;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectorComponent>,
    ) {
  }
  
  ngOnInit(): void {
    this.filterTeams(this.data.teams); 
  }

  filterTeams(teams: Team[]) {
    teams.forEach(team => {
      team.team.country === 'England' && this.premierLeagueClubs.push(team);
      team.team.country === 'Germany' && this.germanClubs.push(team);
      team.team.country === 'France' && this.frenchClubs.push(team);
      team.team.country === 'Spanish' && this.spanishClubs.push(team);
      team.team.country === 'Portugal' && this.portugueseClubs.push(team);
      team.team.country === 'Italy' && this.italianClubs.push(team);
    });
  }

  openDropdown() {
    this.dropdown.open();
  }

  onSelected(string: string) {
      if (string === 'club') {
        this.teamSelected = true;
        this.selectedCountry = null;
      } else {
        this.selectedTeam = null;
        this.teamSelected = false;
      }
      this.dropdown.open();
      this.showButtons = false;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSuccess(): void {
    const result = this.selectedCountry ? this.selectedCountry : this.selectedTeam
    this.dialogRef.close(result);
  }
}
