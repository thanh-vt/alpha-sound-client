import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSongFromPlaylistComponent } from './delete-song-from-playlist';

describe('DeleteSongFromPlaylist', () => {
  let component: DeleteSongFromPlaylistComponent;
  let fixture: ComponentFixture<DeleteSongFromPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteSongFromPlaylistComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSongFromPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
