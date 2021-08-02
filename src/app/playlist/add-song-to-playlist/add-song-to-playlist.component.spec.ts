import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSongToPlaylistComponent } from './add-song-to-playlist.component';

describe('AddSongToPlaylistComponent', () => {
  let component: AddSongToPlaylistComponent;
  let fixture: ComponentFixture<AddSongToPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSongToPlaylistComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSongToPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
