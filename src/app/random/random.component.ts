import { Component, OnInit } from '@angular/core';
import { FootballService } from '../football.service';
import { Subject, takeUntil } from 'rxjs';
import { Team } from '../models';

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.scss']
})
export class RandomComponent implements OnInit{

  teams: Team[] = [];
  isLoading: boolean = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private footballService: FootballService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.footballService.getPremierLeagueTeams().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.teams = data.response;
      },  
      error: (error) => console.error(error),
      complete: () => this.isLoading = false
    })
  }
}
