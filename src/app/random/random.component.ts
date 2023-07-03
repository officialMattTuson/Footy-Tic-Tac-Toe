import {Component, OnInit} from '@angular/core';
import {FootballService} from '../football.service';
import {Subject, filter, take, takeUntil} from 'rxjs';
import {Country, League, LeagueParent, Team, topFootballLeagueIds, topFootballingNations} from '../models';

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.scss']
})
export class RandomComponent implements OnInit{

  teams: Team[] = [];
  countries: Country[] = [];
  leagues: League[] = [];
  isLoading: boolean = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private footballService: FootballService) {}

ngOnInit(): void {
    // this.getTopDivisions();
    // this.getCountries();
    // this.getTeamById();
  }

  getTopDivisions() {
    this.isLoading = true;
    this.footballService.getTopDivisions().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.filterLeagues(data.response),  
      error: (error) => console.error(error),
      complete: () => this.isLoading = false
    });
  }

  getCountries() {
    this.footballService.getCountries().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.filterCountries(data.response),
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
  }

  filterLeagues(leagues: LeagueParent[]) {
    if (!leagues) {
      return;
    }
    const filteredLeagues = leagues.filter(league => topFootballLeagueIds.includes(league.league.id))
    // filteredLeagues.forEach(league => this.getTopDivisionTeams(league));
    this.getTopDivisionTeams(filteredLeagues[0])
  }

  getTopDivisionTeams(league: LeagueParent) {
    this.footballService.getTopDivisionTeams(league.league.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.teams.push(data.response);
        console.log(this.teams);
      },  
      error: (error) => console.error(error),
    })
  }

}
