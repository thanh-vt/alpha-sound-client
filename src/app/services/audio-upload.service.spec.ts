import { TestBed } from '@angular/core/testing';

import { AudioUploadService } from './audio-upload.service';

describe('AudioUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioUploadService = TestBed.get(AudioUploadService);
    expect(service).toBeTruthy();
  });
});
