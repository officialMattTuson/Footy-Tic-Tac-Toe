import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerScoreService {

  constructor() { }

  private _playerOneScore = new BehaviorSubject<number>(0);
  public playerOneScore$ = this._playerOneScore.asObservable();
  
  private _playerTwoScore = new BehaviorSubject<number>(0);
  public playerTwoScore$ = this._playerTwoScore.asObservable();

  public playerOneWins() {
    const currentPlayerOneScore = this._playerOneScore.getValue();
    this._playerOneScore.next(currentPlayerOneScore + 1);
  }

  public playerTwoWins() {
    const currentPlayerTwoScore = this._playerTwoScore.getValue();
    this._playerTwoScore.next(currentPlayerTwoScore + 1);
  }
}
