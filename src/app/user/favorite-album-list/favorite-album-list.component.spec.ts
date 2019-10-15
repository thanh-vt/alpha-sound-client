import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteAlbumListComponent } from './favorite-album-list.component';

describe('FavoriteAlbumListComponent', () => {
  let component: FavoriteAlbumListComponent;
  let fixture: ComponentFixture<FavoriteAlbumListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteAlbumListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteAlbumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
