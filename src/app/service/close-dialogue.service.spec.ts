import { TestBed } from '@angular/core/testing';

import { CloseDialogueService } from './close-dialogue.service';

describe('CloseDialogueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloseDialogueService = TestBed.get(CloseDialogueService);
    expect(service).toBeTruthy();
  });
});
