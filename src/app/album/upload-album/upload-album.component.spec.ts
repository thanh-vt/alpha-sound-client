import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadAlbumComponent } from './upload-album.component';

describe('UploadAlbumComponent', () => {
  let component: UploadAlbumComponent;
  let fixture: ComponentFixture<UploadAlbumComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UploadAlbumComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
