import { TestBed } from '@angular/core/testing';

import { AddSongToPlaying } from './add-song-to-playling.service';

describe('AddSongToPlaying', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddSongToPlaying = TestBed.get(AddSongToPlaying);
    expect(service).toBeTruthy();
  });
});
