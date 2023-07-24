import { TestBed } from '@angular/core/testing';

import { PlayerScoreService } from './player-score.service';

describe('PlayerScoreService', () => {
  let service: PlayerScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
