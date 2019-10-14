import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistUploadComponent } from './artist-upload.component';

describe('ArtistUploadComponent', () => {
  let component: ArtistUploadComponent;
  let fixture: ComponentFixture<ArtistUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
