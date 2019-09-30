import { TestBed } from '@angular/core/testing';

import { AddSongToPlaylistService } from './add-song-to-playlist.service';

describe('AddSongToPlaylistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddSongToPlaylistService = TestBed.get(AddSongToPlaylistService);
    expect(service).toBeTruthy();
  });
});
