import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Country, Team } from '../models';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {

  selectedTeam?: Team | null;
  selectedCountry?: Country | null;
  teamSelected?: boolean;
  showButtons: boolean = true;

  @ViewChild('dropdown') dropdown!: MatSelect;

  countries = [
    {name: 'Argentina', code: 'AR', flag: 'https://media-1.api-sports.io/flags/ar.svg'},
    {name: 'Belgium', code: 'BE', flag: 'https://media-2.api-sports.io/flags/be.svg'},
    {name: 'Brazil', code: 'BR', flag: 'https://media-2.api-sports.io/flags/br.svg'},
    {name: 'Croatia', code: 'HR', flag: 'https://media-3.api-sports.io/flags/hr.svg'},
    {name: 'England', code: 'GB', flag: 'https://media-2.api-sports.io/flags/gb.svg'},
    {name: 'France', code: 'FR', flag: 'https://media-2.api-sports.io/flags/fr.svg'},
    {name: 'Germany', code: 'DE', flag: 'https://media-1.api-sports.io/flags/de.svg'},
  ]

  teams = [
    [
      {team: {name: 'Manchester City', logo: 'https://media-3.api-sports.io/football/teams/50.png'}},
      {team: {name: 'Manchester United', logo: 'https://media-3.api-sports.io/football/teams/33.png'}},
      {team: {name: 'Chelsea', logo: 'https://media-3.api-sports.io/football/teams/49.png'}},
    ]
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectorComponent>,
    ) {
  }
  
  ngOnInit(): void {
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
