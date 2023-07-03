import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FootballService {

  private apiKey = '0fb663d10f25b431747cfffcf2c0af01';
  private apiUrl = 'https://v3.football.api-sports.io';
  private hostUrl = 'v3.football.api-sports.io';

  headers = {
    'x-rapidapi-host': this.hostUrl,
    'x-rapidapi-key': this.apiKey,
  };
  constructor(private http: HttpClient) { }

  getPremierLeagueTeams(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/teams?league=39&season=2023`, {'headers': this.headers} );
  }

  getCountries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/teams/countries`, {'headers': this.headers} );
  }
}
