import {Component, OnInit} from '@angular/core';
import {FootballService} from '../football.service';
import {Subject, take, takeUntil} from 'rxjs';
import {Country, Team, topFootballingNations} from '../models';

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.scss']
})
export class RandomComponent implements OnInit{

  teams: Team[] = [];
  countries: Country[] = [];
  isLoading: boolean = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private footballService: FootballService) {}

  ngOnInit(): void {
    // this.getPremierLeagueTeams();
    this.getCountries();
    // this.getTeamById();
  }

  getPremierLeagueTeams() {
    this.isLoading = true;
    this.footballService.getPremierLeagueTeams().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.teams = data.response;
      },  
      error: (error) => console.error(error),
      complete: () => this.isLoading = false
    });
  }

  getCountries() {
    this.footballService.getCountries().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.countries = data.response;
        this.filterCountries(this.countries);
      },
      error: (error) => console.error(error),
    });
  }

  getTeamById() {
    this.footballService.getTeamStatsById(50).pipe(take(1)).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error),
    });
  }

  filterCountries(countries: Country[]) {
    const filteredCountryObjects = countries.filter(obj => topFootballingNations.includes(obj.name));
    this.countries = filteredCountryObjects;
    console.log(this.countries)
  }
}
