import { TestBed } from '@angular/core/testing';

import { PlayingQueueService } from './playing-queue.service';

describe('AddSongToPlaying', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayingQueueService = TestBed.get(PlayingQueueService);
    expect(service).toBeTruthy();
  });
});
