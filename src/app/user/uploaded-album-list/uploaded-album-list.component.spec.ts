import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedAlbumListComponent } from './uploaded-album-list.component';

describe('UploadedAlbumListComponent', () => {
  let component: UploadedAlbumListComponent;
  let fixture: ComponentFixture<UploadedAlbumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadedAlbumListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedAlbumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
