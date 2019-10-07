import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePlaylistSongComponent } from './delete-playlist-song.component';

describe('DeletePlaylistSongComponent', () => {
  let component: DeletePlaylistSongComponent;
  let fixture: ComponentFixture<DeletePlaylistSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePlaylistSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePlaylistSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
