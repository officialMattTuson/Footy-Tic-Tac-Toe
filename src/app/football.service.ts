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

  getTopDivisionTeams(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/teams?league=${id}&season=2022`, {'headers': this.headers} );
  }

  getTopDivisions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leagues?season=2022`, {'headers': this.headers} );
  }

  getProfessionalTeamsByCountry(country: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/teams?country=${country}`, {'headers': this.headers} );
  }

  getCountries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/teams/countries`, {'headers': this.headers} );
  }

  getTeamStatsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/teams/seasons?team=${id}`, {'headers': this.headers} );
  }

  searchPlayer(query: string) {
    return this.http.get<any>(`${this.apiUrl}/players?league=39&search=${query}`, {'headers': this.headers} );
  }

  getPlayersListOfTeams(id: number) {
    return this.http.get<any>(`${this.apiUrl}/transfers?player=${id}`, {'headers': this.headers} );
  }
}
