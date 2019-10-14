import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteSongListComponent } from './favorite-song-list.component';

describe('FavoriteSongListComponent', () => {
  let component: FavoriteSongListComponent;
  let fixture: ComponentFixture<FavoriteSongListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteSongListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteSongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
